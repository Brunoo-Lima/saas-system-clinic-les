import { Doctor } from "../../EntityDoctor/Doctor";
import { Patient } from "../../EntityPatient/Patient";

export interface IMovements {
    total: number,
    dateMovement: Date,
    percentInsurance: number,
    percentDoctor: number,
    patient: Patient,
    doctor: Doctor,
}