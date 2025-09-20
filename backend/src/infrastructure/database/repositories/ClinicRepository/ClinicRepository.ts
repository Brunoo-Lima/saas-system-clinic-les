import { eq } from 'drizzle-orm';
import { Clinic } from '../../../../domain/entities/EntityClinic/Clinic';
import { ResponseHandler } from '../../../../helpers/ResponseHandler';
import db from '../../connection';
import { clinicTable } from '../../Schema/ClinicSchema';
import { IClinicRepository } from './IClinicRepository';

export class ClinicRepository implements IClinicRepository {
  async create(clinic: Clinic): Promise<any> {
    try {
      if (
        !clinic.name ||
        !clinic.cnpj ||
        !clinic.phone ||
        !clinic.timeToConfirmScheduling
      ) {
        return ResponseHandler.error(['Missing required fields']);
      }

      const clinicInserted = await db
        .insert(clinicTable)
        .values({
          name: clinic.name,
          cnpj: clinic.cnpj,
          phone: clinic.phone,
          address_id: null,
          user_id: null,
          timeToConfirmScheduling: clinic.timeToConfirmScheduling,
        })
        .returning();

      return ResponseHandler.success(
        clinicInserted[0],
        'Clinic created successfully.',
      );
    } catch (e) {
      return ResponseHandler.error(['Failed to save a clinic']);
    }
  }

  async findAll(): Promise<any> {
    try {
      const clinics = await db.select().from(clinicTable);
      return clinics;
    } catch (e) {
      return ResponseHandler.error(['Failed to find clinics']);
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const clinic = await db
        .select()
        .from(clinicTable)
        .where(eq(clinicTable.id, id));
      return clinic;
    } catch (e) {
      return ResponseHandler.error(['Failed to find clinic by id']);
    }
  }

  async findByCnpj(cnpj: string): Promise<any> {
    try {
      const clinic = await db
        .select()
        .from(clinicTable)
        .where(eq(clinicTable.cnpj, cnpj));

      return clinic[0] || null;
    } catch (e) {
      return ResponseHandler.error([
        'Failed to find clinic by cnpj',
      ]) as Partial<Clinic> | null;
    }
  }

  async update(id: string, data: Partial<Clinic>): Promise<any> {
    try {
      const clinic = await db
        .update(clinicTable)
        .set(data)
        .where(eq(clinicTable.id, id))
        .returning();

      return ResponseHandler.success(
        clinic[0] as Partial<Clinic>,
        'Clinic updated successfully.',
      ) as Partial<Clinic> | null;
    } catch (e) {
      return ResponseHandler.error([
        'Failed to update clinic',
      ]) as Partial<Clinic> | null;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      await db.delete(clinicTable).where(eq(clinicTable.id, id));
      return true;
    } catch (e) {
      return ResponseHandler.error(['Failed to delete clinic']);
    }
  }
}
