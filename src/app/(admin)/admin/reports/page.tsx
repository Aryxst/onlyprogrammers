import { unstable_cache as cacheV2 } from 'next/cache';
import { redirect } from 'next/navigation';
import { DataTable, columns } from './component.client';
import { db } from '@/db';
import getSession from '@/lib/get-session';

const getAllCachedReports = cacheV2(
 async () => {
  return await db.query.globalMessageReport.findMany();
 },
 [],
 { revalidate: 300, tags: ['get-all-global-messages-reports_admin'] },
);

export default async function Page() {
 const session = await getSession();
 const user = session?.user;

 if (!user) {
  redirect('/auth?callbackUrl=/admin');
 }

 if (user.role === 'USER') {
  redirect('/');
 }
 const data = await getAllCachedReports();
 return (
  <main className='my-4 px-3 py-10'>
   <section className='mx-auto max-w-7xl space-y-6'>
    <h1 className='text-3xl font-bold'>Admin Page</h1>
    <div className='mt-4'>
     <DataTable columns={columns} data={data} />
    </div>
   </section>
  </main>
 );
}
