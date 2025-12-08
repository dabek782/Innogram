import { provider } from "@prisma/client"

export class AccountModel{
  id:string
  user_id:string
  email:string
  password_hash : string
  provider : provider
  provider_id: string | null
  last_login_at: Date | null
  created_at:Date
  updated_at:Date
  created_by_id :string | null
  updated_by_id : string | null
}