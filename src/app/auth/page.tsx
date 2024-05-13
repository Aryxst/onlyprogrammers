import LoginForm from './component.client';
import { Suspense } from 'react';

export default async function LoginPage() {
 return (
  <main className='flex min-h-screen flex-col items-center justify-center'>
   <Suspense fallback={<p>Loading...</p>}>
    <LoginForm />
   </Suspense>
  </main>
 );
}
