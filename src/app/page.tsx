import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { unstable_cache as cacheV2 } from 'next/cache';
import { marked } from 'marked';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';
import Client, { MessageInteractionDropdown } from './component.client';
import getSession from '@/lib/getSession';
import { timeSince } from '@/lib/time';

export const metadata: Metadata = {
 title: 'Only Programmers - Settings',
};

const getCachedUser = cacheV2(
 async (id: string) => {
  return await db.query.user.findFirst({
   where: eq(schema.user.id, id),
  });
 },
 ['get-cached-user'],
 { revalidate: 300 },
);

const messagesCache = cacheV2(
 async () => {
  const messages = await db.query.globalMessage.findMany();
  return Promise.all(
   messages.map(async message => {
    const creator = await getCachedUser(message.authorId);
    return {
     ...message,
     creator,
    };
   }),
  );
 },
 ['get-global-messages'],
 { revalidate: 30 },
);
export type MessageType = Awaited<ReturnType<typeof messagesCache>>[number];

export default async function Page() {
 const session = await getSession();
 const user = session?.user;

 if (!user) {
  redirect('/auth?callbackUrl=/settings');
 }

 const messages = await messagesCache();

 return (
  <main className='mt-4 px-3 py-10'>
   <section className='mx-auto max-w-7xl space-y-6'>
    <div className='mx-auto max-w-2xl'>
     <Client />
     <div className='mt-8'>
      <ul className='flex flex-col gap-8'>
       {messages.map((message, i) => {
        const creationDate = new Date(message.createdAt);
        const isMessageAuthor = message?.authorId === user.id;
        const isAdmin = user?.role === 'ADMIN';

        return (
         <li className='flex min-h-24 flex-col gap-1 border-b border-b-neutral-200' key={i} id={message.id}>
          <div className='flex flex-row justify-between'>
           <ul className='flex flex-row items-center gap-2'>
            <li>
             <Link href={`/user/${message.creator?.id}`}>
              <Image src={message.creator?.image || ''} className='rounded-full' alt={`${message.creator?.name}'s profile`} width={40} height={40} title={message.creator?.name || 'N/A'} />
             </Link>
            </li>
            <li className='text-sm font-bold'>{message.creator?.name}</li>
            <li className='text-xs text-neutral-500'>
             <span className='mr-2'>&bull;</span>
             {timeSince(creationDate)}
            </li>
           </ul>
          </div>
          <div className='mt-4 pl-[52px]'>
           <div className='prose prose-a:text-blue-500 prose-a:no-underline prose-a:hover:underline' dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }} />
           <ul className='mt-2 flex flex-row justify-end gap-2 pr-4'>
            <li>
             <MessageInteractionDropdown message={message} isMessageAuthor={isMessageAuthor} isAdmin={isAdmin} />
            </li>
           </ul>
          </div>
         </li>
        );
       })}
      </ul>
     </div>
    </div>
   </section>
  </main>
 );
}
