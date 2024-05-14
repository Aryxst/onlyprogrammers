'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { globalMessage } from '@/db/schema/message';
import { addGlobalMessageSchema, type addGlobalMessageValues } from '@/lib/validation';

export async function addGlobalMessage(values: addGlobalMessageValues) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId) {
  throw Error('Unauthorized');
 }

 const { content } = addGlobalMessageSchema.parse(values);

 await db.insert(globalMessage).values({ content, authorId: userId });

 revalidatePath('/');
}

export async function deleteGlobalMessage(id: string, authorId: string) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId || userId !== authorId || (userId !== authorId && session.user.role !== 'ADMIN')) {
  throw Error('Unauthorized');
 }

 await db.delete(globalMessage).where(eq(globalMessage.id, id));

 revalidatePath('/');
}
