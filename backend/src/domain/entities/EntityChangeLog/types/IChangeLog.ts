import { User } from "../../EntityUser/User"

export interface IChangeLog {
    id?: string | undefined
    table_name?: string | undefined
    row_id?: string | undefined
    actions?: string | undefined
    description?: string | undefined
    user?: User | undefined
}