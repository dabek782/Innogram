import { Role } from '@prisma/client';

export class UserResponseData {
  id: string;
  role: Role;
  disabled: false;
  created_at: Date;
  updated_at: Date;
  crearted_by_id?: string | null;
  updated_by_id?: string | null;
}
