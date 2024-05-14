import db, { user } from '@/db';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { cache } from 'react';

interface Props {
 params: { id: string };
}

const getUser = cache(async (id: string) => {
 return await db.query.user.findFirst({
  where: eq(user.id, id),
 });
});

export async function generateStaticParams() {
 const allUsers = await db.query.user.findMany();

 return allUsers.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params: { id } }: Props) {
 const user = await getUser(id);

 return {
  title: user?.name || `User ${id}`,
 };
}

export default async function Page({ params: { id } }: Props) {
 const user = await getUser(id);

 if (!user) notFound();

 return (
  <div className='mx-3 my-10 flex flex-col items-center gap-3'>
   {user.image && <Image src={user.image} width={100} alt='User profile picture' height={100} className='rounded-full' />}
   <h1 className='text-center text-xl font-bold'>{user?.name || `User ${id}`}</h1>
   <p className='text-muted-foreground'>User since {new Date(user.joinedAt).toLocaleDateString()}</p>
  </div>
 );
}
