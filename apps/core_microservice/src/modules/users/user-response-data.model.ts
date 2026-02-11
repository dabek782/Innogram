import { Role } from '@prisma/client';
import { User } from '@prisma/client';
import { randomUUID } from 'crypto';
export class UserResponseData {
  id: string;
  role: Role;
  disabled: boolean;
  created_at: Date;
  updated_at: Date;
  created_by_id?: string | null;
  updated_by_id?: string | null;
}

export const toUserResponseData = (
  entity: User | null
): UserResponseData | null => {
  if (!entity) {
    return null;
  }
  return {
    id: entity.id ?? randomUUID(),
    role: entity.role ?? 'user',
    disabled: entity.disabled ?? false,
    created_at: entity.createdAt,
    updated_at: entity.updatedAt,
  };
};
