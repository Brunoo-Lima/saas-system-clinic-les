import { and, eq, ilike, isNotNull, or, sql } from 'drizzle-orm';
import { Clinic } from '../../../../domain/entities/EntityClinic/Clinic';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import db from '../../connection';
import { clinicTable, clinicToInsuranceTable, clinicToSpecialtyTable } from '../../Schema/ClinicSchema';
import { IRepository } from '../IRepository';
import { EntityDomain } from '../../../../domain/entities/EntityDomain';
import { specialtyTable } from '../../Schema/SpecialtySchema';
import { insuranceTable, insuranceToModalitiesTable } from '../../Schema/InsuranceSchema';
import { userTable } from '../../Schema/UserSchema';
import { addressTable, cityTable, countryTable, stateTable } from '../../Schema/AddressSchema';
import { modalityTable } from '../../Schema/ModalitiesSchema';

export class ClinicRepository implements IRepository {
  async create(clinic: Clinic, tx?: any): Promise<any> {
    // Se for enviado um tx da transaction usamos ela.
    const dbUse = tx ? tx : db
    const clinicInserted = await dbUse.insert(clinicTable).values({
      id: clinic.getUUIDHash(),
      cnpj: clinic.cnpj ?? "",
      name: clinic.name ?? "",
      phone: clinic.phone ?? "",
      timeToConfirmScheduling: clinic.timeToConfirmScheduling ?? "",
      address_id: clinic.address?.getUUIDHash(),
      user_id: clinic.user?.getUUIDHash()
    }).returning()

    if (clinic.insurances && clinic.insurances.length !== 0) {
      await dbUse.insert(clinicToInsuranceTable).values(clinic.insurances.map((ins) => {
        return {
          clinic_id: clinic.getUUIDHash(),
          insurance_id: ins.getUUIDHash(),
        }
      }) ?? [])
    }
    if (clinic.specialties && clinic.specialties.length !== 0) {
      await dbUse.insert(clinicToSpecialtyTable).values(clinic.specialties?.map((spe) => {
        return {
          clinic_id: clinic.getUUIDHash(),
          price: spe.price,
          specialty_id: spe.getUUIDHash()
        }
      }) ?? [])
    }

    return clinicInserted

  }
  async findEntity(clinic: Clinic, tx?: any): Promise<any> {
    try {
      const dbUse = tx ? tx : db
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

      const clinicFounded = await dbUse
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
  async findAllEntity(clinic: Clinic, limit: number, offset: number) {
    try {
      const filters = []
      const userFilters = []
      if (clinic?.getUUIDHash()) filters.push(eq(clinicTable.id, clinic.getUUIDHash()))
      if (clinic?.cnpj) filters.push(eq(clinicTable.cnpj, clinic.cnpj ?? ""))
      if (clinic?.user?.getUUIDHash()) userFilters.push(eq(userTable.id, clinic.user?.getUUIDHash() ?? ""))
      return await db
        .select({
          id: clinicTable.id,
          name: clinicTable.name,
          cnpj: clinicTable.cnpj,
          phone: clinicTable.phone,
          user: sql`
            json_build_object(
              'id', ${userTable.id},
              'email', ${userTable.email},
              'status', ${userTable.status},
              'profileCompleted', ${userTable.profileCompleted},
              'avatar', ${userTable.avatar},
              'username', ${userTable.username},
              'emailVerified', ${userTable.emailVerified}
            )
          `,
          address: sql`
          (
            SELECT json_build_object(
              'id', ${addressTable.id},
              'name', ${addressTable.name},
              'street', ${addressTable.street},
              'cep', ${addressTable.cep},
              'number', ${addressTable.number},
              'neighborhood', ${addressTable.neighborhood},
              'city', json_build_object(
                'id', ${cityTable.id},
                'name', ${cityTable.name}
              ),
              'state', json_build_object(
                'id', ${stateTable.id},
                'name', ${stateTable.name},
                'uf', ${stateTable.uf}
              ),
              'country', json_build_object(
                'id', ${countryTable.id},
                'name', ${countryTable.name}
              )
            )
            FROM ${addressTable}
            LEFT JOIN ${cityTable} ON ${cityTable.id} = ${addressTable.city_id}
            LEFT JOIN ${stateTable} ON ${stateTable.id} = ${cityTable.state_id}
            LEFT JOIN ${countryTable} ON ${countryTable.id} = ${stateTable.country_id} 
            WHERE ${addressTable.id} = ${clinicTable.address_id}
          )`,
          specialties: sql`
          (
            SELECT json_agg(
              json_build_object(
                'id', ${specialtyTable.id},
                'name', ${specialtyTable.name},
                'price', ${clinicToSpecialtyTable.price}
              )
            )
            FROM ${clinicToSpecialtyTable}
            INNER JOIN ${specialtyTable} ON ${specialtyTable.id} = ${clinicToSpecialtyTable.specialty_id}
            WHERE ${clinicToSpecialtyTable.clinic_id} = ${clinicTable.id}
          )`,
          insurances: sql`
          (
            SELECT json_agg(
              json_build_object(
                'id', ${insuranceTable.id},
                'name', ${insuranceTable.name}
              )
            )
            FROM ${clinicToInsuranceTable}
            INNER JOIN ${insuranceTable} ON ${insuranceTable.id} = ${clinicToInsuranceTable.insurance_id}
            WHERE ${clinicToInsuranceTable.clinic_id} = ${clinicTable.id}
          )`
        })
        .from(clinicTable)
        .innerJoin(
          userTable,
          and(
            or(
              ...userFilters,
              eq(userTable.email, clinic?.user?.email ?? ""), 
              isNotNull(userTable.id)
            ),
            eq(userTable.id, clinicTable.user_id)
          )
        )
        .where(
          or(...filters)
        ).groupBy(
          clinicTable.id,
          userTable.id
        ).offset(offset)
        .limit(limit)
    } catch (e) {
      return ResponseHandler.error((e as Error).message)
    }
  }

}
