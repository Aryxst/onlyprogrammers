'use client';
import { useSession } from 'next-auth/react';

export default function ClientComponent() {
 const session = useSession();

 return (
  <div>
   <p className='font-bold'>Client:</p>
   <pre>{JSON.stringify(session, null, 2)}</pre>
  </div>
 );
}
