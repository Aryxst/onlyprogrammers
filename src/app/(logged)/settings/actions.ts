'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db, user } from '@/db';
import { eq } from 'drizzle-orm';
import { updateProfileSchema, type UpdateProfileValues } from '@/lib/validation';

export async function updateProfile(values: UpdateProfileValues) {
 const session = await auth();
 const userId = session?.user?.id;

 if (!userId) {
  throw Error('Unauthorized');
 }

 const { name } = updateProfileSchema.parse(values);

 await db.update(user).set({ name }).where(eq(user.id, userId));

 revalidatePath('/');
}
