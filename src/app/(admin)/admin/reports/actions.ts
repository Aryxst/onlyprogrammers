'use server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/auth';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function deleteGlobalMessageReport(id: string) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId || session.user.role !== 'ADMIN') {
  throw Error('Unauthorized');
 }

 await db.delete(schema.globalMessageReport).where(eq(schema.globalMessageReport.id, id));
 revalidateTag('get-all-global-messages-reports_admin');
}
export async function invalidateCache() {
 revalidateTag('get-all-global-messages-reports_admin');
 redirect('/admin/reports');
}
