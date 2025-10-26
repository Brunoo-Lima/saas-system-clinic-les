import { sql } from "drizzle-orm";
import { ResponseHandler } from "../../../../helpers/ResponseHandler";
import db from "../../connection";
import { doctorToSpecialtyTable } from "../../Schema/DoctorSchema";
import { insuranceToSpecialtyTable } from "../../Schema/InsuranceSchema";
import { clinicToSpecialtyTable } from "../../Schema/ClinicSchema";

export class FinancialQueriesDAO {
    async getTotalDoctorSpecialty(doctor_id: string){
        try {
            const totalDistributionPerDoctor = await db.execute(sql`
                SELECT  
                    ${doctorToSpecialtyTable.percent_distribution}::FLOAT as percent
                FROM ${doctorToSpecialtyTable}
                WHERE ${doctorToSpecialtyTable.doctor_id} = ${doctor_id} AND ${doctorToSpecialtyTable.percent_distribution} IS NOT NULL;

            `)
            return ResponseHandler.success(totalDistributionPerDoctor.rows, "Success ! Data returned")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }

    async getTotalInsurancePerSpecialty(insurance_id: string, specialtyId: string){
        try {
            const totalTransferInsurance = await db.execute(sql`
                SELECT 
                    ${insuranceToSpecialtyTable.amountTransferred} as total_transferred
                FROM ${insuranceToSpecialtyTable}
                WHERE 
                    ${insuranceToSpecialtyTable.insurance_id} = ${insurance_id} AND 
                    ${insuranceToSpecialtyTable.specialty_id} = ${specialtyId} AND
                    ${insuranceToSpecialtyTable.amountTransferred} IS NOT NULL
            `)
            return ResponseHandler.success(totalTransferInsurance.rows, "Success ! Amounted of transferred founded.")
        } catch(e) {
            return ResponseHandler.error((e as Error).message)
        }
    }

    async getTotalClinicPerSpecialty(specialty_id: string){
        try {
            const totalPrice = await db.execute(sql`
                SELECT 
                    ${clinicToSpecialtyTable.price} as total
                FROM ${clinicToSpecialtyTable}
                WHERE ${clinicToSpecialtyTable.specialty_id} = ${specialty_id} AND ${clinicToSpecialtyTable.price} IS NOT NULL;     
            `)
            return ResponseHandler.success(totalPrice.rows, "Success ! Clinic price per specialty founded.")
        } catch(e) {
            console.log(e)
            return ResponseHandler.error((e as Error).message)
        }
    }
}