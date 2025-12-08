import { role } from "@prisma/client"

export class UserModel {
    id:string
    role: role
    disabled : false
    created_at: Date
    updated_at: Date
    crearted_by_id?: string | null
    updated_by_id?: string | null
 }