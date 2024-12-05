import type { Metadata } from 'next';
import { unstable_cache as cacheV2 } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { marked } from 'marked';
import { db, schema } from '@/db';
import { desc, eq } from 'drizzle-orm';
import Client, { MessageInteractionDropdown } from './component.client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import getSession from '@/lib/get-session';
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
 { revalidate: 360, tags: ['get-cached-user'] },
);

const messagesCache = cacheV2(
 async () => {
  const messages = await db.select().from(schema.globalMessage).orderBy(desc(schema.globalMessage.createdAt));

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
 [],
 { revalidate: 120, tags: ['get-global-messages'] },
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
  <main className='my-4 px-3 py-10'>
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
         <li className='flex min-h-24 flex-col gap-1 border-b border-b-neutral-200' key={i}>
          <div className='flex flex-row gap-2'>
           <Link href={`/user/${message.creator?.id}`}>
            <Avatar>
             <AvatarImage src={message.creator?.image!} alt={message.creator?.name!} />
             <AvatarFallback>{message.creator?.name?.at(0)?.toUpperCase()}</AvatarFallback>
            </Avatar>
           </Link>
           <div className='flex flex-col justify-center'>
            <ul className='flex flex-row items-center gap-2'>
             <li className='text-sm font-bold'>{message.creator?.name}</li>
             <li className='text-xs text-neutral-500'>
              <span className='mr-2'>&bull;</span>
              {timeSince(creationDate)} ago
             </li>
             {message.editedAt && (
              <li className='text-xs text-neutral-500'>
               <span className='mr-2'>(edited)</span>
              </li>
             )}
            </ul>
           </div>
          </div>

          <div className='mt-4'>
           <div className='prose prose-a:text-blue-500 prose-a:no-underline prose-a:hover:underline' dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }} />
           <ul className='mt-2 flex flex-row justify-end gap-2 pr-8'>
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
