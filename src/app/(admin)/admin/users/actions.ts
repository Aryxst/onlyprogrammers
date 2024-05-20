'use server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { ExtendedUser } from '@/types/next-auth';

export async function deleteUser(user: ExtendedUser) {
 const session = await auth();

 if (user.role === 'ADMIN' || session?.user.id === user.id) {
  throw Error('Unauthorized');
 }

 await db.delete(schema.user).where(eq(schema.user.id, user.id!));

 revalidateTag('get-all-users_admin');
 revalidateTag('get-global-messages');
}
export async function invalidateCache() {
 revalidateTag('get-all-users_admin');
}
