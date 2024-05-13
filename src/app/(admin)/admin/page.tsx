import { redirect } from 'next/navigation';
import getSession from '@/lib/getSession';

export default async function Page() {
 const session = await getSession();
 const user = session?.user;
 if (!user) {
  redirect('/auth?callbackUrl=/admin');
 }
 if (user.role === 'USER') {
  redirect('/');
 }
 return (
  <main className='px-3 py-10'>
   <section className='mx-auto max-w-7xl space-y-6'>
    <h1 className='text-3xl font-bold'>Admin Page</h1>
   </section>
  </main>
 );
}
