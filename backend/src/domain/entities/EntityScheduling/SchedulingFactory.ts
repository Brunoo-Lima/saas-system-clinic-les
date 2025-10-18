import { ConsultationSchedulingDTO } from "../../../infrastructure/DTOs/ConsultationSchedulingDTO";
import { DoctorBuilder } from "../EntityDoctor/DoctorBuilder";
import { InsuranceBuilder } from "../EntityInsurance/InsuranceBuilder";
import { PatientBuilder } from "../EntityPatient/PatientBuilder";
import { SpecialtyBuilder } from "../EntitySpecialty/SpecialtyBuilder";
import { SchedulingBuilder } from "./SchedulingBuilder";

export class SchedulingFactory {
    static createFromDTO(schedulingDTO: ConsultationSchedulingDTO) {
        // PATIENT
        const patient = new PatientBuilder()
        .setCpf(schedulingDTO.patient.cpf)
        .build()
        patient.setUuidHash(schedulingDTO.patient.id ?? "")

        // DOCTOR
        const doctor = new DoctorBuilder()
        .setCpf(schedulingDTO.doctor.cpf)
        .setCrm(schedulingDTO.doctor.crm)
        .build()
        doctor.setUuidHash(schedulingDTO.doctor.id ?? "")

   
        const insurance = new InsuranceBuilder()
        .setName(schedulingDTO.insurance.name)
        .build();
        insurance.setUuidHash(schedulingDTO.insurance.id ?? "");

    
        const specialty = new SpecialtyBuilder()
            .setName(schedulingDTO.specialty.name)
            .build();
        specialty.setUuidHash(schedulingDTO.specialty.id ??"");

        const combinedString = `${schedulingDTO.date}T${schedulingDTO.hour}`; 
        const combinedDate = new Date(combinedString);
        
        const scheduling = new SchedulingBuilder()
        .setDate(combinedDate ?? undefined)
        .setDateOfConfirmation(schedulingDTO.dateOfConfirmation ? new Date(schedulingDTO.dateOfConfirmation) : undefined)
        .setDoctor(doctor)
        .setInsurance(insurance)
        .setIsReturn(schedulingDTO.isReturn)
        .setPatient(patient)
        .setPriceOfConsultation(schedulingDTO.priceOfConsultation)
        .setSpecialty(specialty)
        .setStatus(schedulingDTO.status)
        .build()
        return scheduling
    }
}
