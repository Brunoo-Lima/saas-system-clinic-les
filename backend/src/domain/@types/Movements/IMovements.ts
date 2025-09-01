import { Doctor } from "../../entities/EntityDoctor/Doctor";
import { Patient } from "../../entities/EntityPatient/Patient";

export interface IMovements {
    total: number,
    dateMovement: Date,
    percentInsurance: number,
    percentDoctor: number,
    patient: Patient,
    doctor: Doctor,
}