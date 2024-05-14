import { unstable_cache as cacheV2 } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import getSession from '@/lib/getSession';
import { DataTable, columns } from './component.client';

const getAllCachedUsers = cacheV2(
 async () => {
  return await db.query.user.findMany();
 },
 ['get-all-users_admin'],
 { revalidate: 300, tags: ['get-all-users_admin'] },
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
 const data = await getAllCachedUsers();
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
