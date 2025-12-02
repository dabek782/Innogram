export class createUserDto {
  id?:string
  role?:"user" | "admin"
  disabled? : false
  created_by_id?: string | null
  updated_by_id?: string | null
}