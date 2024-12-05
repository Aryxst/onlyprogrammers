import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LoginForm from './component.client';
import getSession from '@/lib/get-session';

export default async function Page() {
 const session = await getSession();
 const user = session?.user;

 if (user) {
  redirect('/');
 }

 return (
  <main className='flex h-[calc(100vh-112px)] items-center justify-center'>
   <Suspense fallback={<p>Loading...</p>}>
    <LoginForm />
   </Suspense>
  </main>
 );
}
