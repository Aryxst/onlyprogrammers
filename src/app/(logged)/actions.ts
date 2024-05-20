'use server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/auth';
import { db, schema } from '@/db';
import { and, eq } from 'drizzle-orm';
import { addGlobalMessageSchema, type AddGlobalMessageValues } from '@/lib/validation';

export async function addGlobalMessage(values: AddGlobalMessageValues) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId) {
  throw Error('Unauthorized');
 }

 const { content } = addGlobalMessageSchema.parse(values);

 await db.insert(schema.globalMessage).values({ content, authorId: userId });

 revalidateTag('get-global-messages');
}

export async function deleteGlobalMessage(id: string, authorId: string) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId || userId !== authorId || session.user.role !== 'ADMIN') {
  throw Error('Unauthorized');
 }
 await db.delete(schema.globalMessage).where(eq(schema.globalMessage.id, id));

 revalidateTag('get-global-messages');
}
export async function reportGlobalMessage(globalMessageId: string, offenderId: string) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId) {
  throw Error('Unauthorized');
 }
 if (userId === offenderId) {
  throw Error('You cannot report yourself');
 }
 const alreadyReportedMessage = await db.query.globalMessageReport.findFirst({ where: and(eq(schema.globalMessageReport.authorId, userId), eq(schema.globalMessageReport.globalMessageId, globalMessageId)) });

 if (!alreadyReportedMessage) {
  await db.insert(schema.globalMessageReport).values({ authorId: userId, globalMessageId, offenderId });
  return true;
 }
 return false;
}
