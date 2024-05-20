import type { DefaultSession } from 'next-auth';
import { type UserRole } from '@/db';

export type ExtendedUser = DefaultSession['user'] & {
 role: UserRole;
 joinedAt: Date;
 emailVerified?: Date | null;
};

declare module 'next-auth' {
 interface Session {
  user: ExtendedUser;
 }
}

import { JWT } from '@auth/core/jwt';

declare module '@auth/core/jwt' {
 interface JWT {
  role?: UserRole;
 }
}
