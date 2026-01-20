import { Role } from '@prisma/client';

export class UserResponseData {
  id: string;
  role: Role;
  disabled: boolean;
  created_at: Date;
  updated_at: Date;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}
