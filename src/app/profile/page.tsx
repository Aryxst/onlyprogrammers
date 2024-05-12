import { auth } from '@/auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
 const session = await auth();
 if (!session?.user) redirect('/api/auth/signin?callbackUrl=/profile');
 return (
  <div>
   <p>Profile</p>
   <Image src={session?.user?.image!} alt='Profile' width={200} height={200} />
   <pre>{JSON.stringify(session, null, 2)}</pre>
  </div>
 );
}
