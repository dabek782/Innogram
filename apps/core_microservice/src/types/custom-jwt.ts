import { JwtPayload } from 'jsonwebtoken';
export interface CustomJwtPayload extends JwtPayload {
  userId: string;
  profileId: string | null;
  accountId: string;
}
