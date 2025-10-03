import { eq, ilike, or } from 'drizzle-orm';
import { Clinic } from '../../../../domain/entities/EntityClinic/Clinic';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import db from '../../connection';
import { clinicTable, clinicToInsuranceTable, clinicToSpecialtyTable } from '../../Schema/ClinicSchema';
import { IRepository } from '../IRepository';
import { EntityDomain } from '../../../../domain/entities/EntityDomain';

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
      .select()
      .from(clinicTable)
      .where(or(...filters));

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
