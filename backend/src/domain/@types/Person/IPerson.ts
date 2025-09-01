import { Document } from "../../entities/Document"

export interface IPerson {
    name: string
    dateOfBirth: Date
    document: Document[] | null
}