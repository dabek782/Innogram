export class UserModel {
    id:string
    role: "admin" | "user"
    disabled : false
    created_at: Date
    updated_at: Date
    created_by_id?: string | null
    updated_by_id?: string | null
 }