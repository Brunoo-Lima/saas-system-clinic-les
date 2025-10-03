import { eq, ilike, or, sql } from 'drizzle-orm';
import { Clinic } from '../../../../domain/entities/EntityClinic/Clinic';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import db from '../../connection';
import { clinicTable, clinicToInsuranceTable, clinicToSpecialtyTable } from '../../Schema/ClinicSchema';
import { IRepository } from '../IRepository';
import { EntityDomain } from '../../../../domain/entities/EntityDomain';
import { specialtyTable } from '../../Schema/SpecialtySchema';
import { insuranceTable } from '../../Schema/InsuranceSchema';

export class ClinicRepository implements IRepository {
  async create(clinic: Clinic, tx?: any): Promise<any> {
    try {
      // Se for enviado um tx da transaction usamos ela.
      const dbUse = tx ? tx : db
      const clinicInserted = await dbUse.insert(clinicTable).values({
        id: clinic.getUUIDHash(),
        cnpj: clinic.cnpj ?? "",
        name: clinic.name ?? "",
        phone: clinic.phone ?? "",
        timeToConfirmScheduling: clinic.timeToConfirmScheduling ?? "",
        address_id: clinic.address?.getUUIDHash(),
        created_at: clinic.getCreatedAt(),
        updated_at: clinic.getUpdatedAt(),
        user_id: clinic.user?.getUUIDHash() 
      }).returning()
      
      if(clinic.insurances && clinic.insurances.length !== 0){
        await dbUse.insert(clinicToInsuranceTable).values(clinic.insurances.map((ins) => {
          return {
            clinic_id: clinic.getUUIDHash(),
            insurance_id: ins.getUUIDHash(),
          }
        }) ?? [])
      }
      if(clinic.specialties && clinic.specialties.length !== 0){
          await dbUse.insert(clinicToSpecialtyTable).values(clinic.specialties?.map((spe) => {
            return {
            clinic_id: clinic.getUUIDHash(),
            price: spe.price,
            specialty_id: spe.getUUIDHash()
          }
        }) ?? [])
      }
      
      return clinicInserted
    } catch(e) {
      return ResponseHandler.error("Failed to create the clinic !")
    }
  }
async findEntity(clinic: Clinic): Promise<any> {
  try {
    const filters = [];

    if (clinic.getUUIDHash()) {
      filters.push(eq(clinicTable.id, clinic.getUUIDHash()));
    }

    if (clinic.name) {
      filters.push(ilike(clinicTable.name, clinic.name ?? ""));
    }

    if (clinic.cnpj) {
      filters.push(eq(clinicTable.cnpj, clinic.cnpj));
    }

    const clinicFounded = await db
      .select({
        id: clinicTable.id,
        name: clinicTable.name,
        cnpj: clinicTable.cnpj,
        specialties: sql`
            json_agg(
              json_build_object(
                'id', ${specialtyTable.id},
                'name', ${specialtyTable.name}
              )
          )
        `,
        insurances: sql`
          json_agg(
            json_build_object(
              'id', ${insuranceTable.id},
              'name', ${insuranceTable.name}
            )
          )
        `
      })
      .from(clinicTable)
      .where(or(...filters))
      .leftJoin(
        clinicToSpecialtyTable,
        eq(clinicToSpecialtyTable.clinic_id, clinicTable.id)
      )
      .leftJoin(
        specialtyTable,
        eq(specialtyTable.id, clinicToSpecialtyTable.specialty_id)
      )
      .leftJoin(
        clinicToInsuranceTable,
        eq(clinicToInsuranceTable.clinic_id, clinicTable.id)
      ).leftJoin(
        insuranceTable,
        eq(insuranceTable.id, clinicToInsuranceTable.insurance_id)
      )
      .groupBy(
        specialtyTable.id,
        clinicTable.id,
        insuranceTable.id
      );

    return clinicFounded;

  } catch (e) {
    return ResponseHandler.error("Failed to find the clinic");
  }
}

  updateEntity(entity: EntityDomain): Promise<any> {
    throw new Error('Method not implemented.');
  }
  deleteEntity(entity: EntityDomain | Array<EntityDomain>, id?: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAllEntity(entity?: EntityDomain | Array<EntityDomain>): Promise<any[]> {
    throw new Error('Method not implemented.');
  }
  
}
