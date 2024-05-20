import { auth } from '@/auth';
import { db } from '@/db';
import { CreatePostValues, createPostSchema } from '@/lib/validation';
import { revalidateTag } from 'next/cache';

export async function createPost(values: CreatePostValues) {
 const session = await auth();
 const userId = session?.user?.id!;

 if (!userId) {
  throw Error('Unauthorized');
 }

 const { title, content } = createPostSchema.parse(values);
 /* 
 await db.insert(schema.post).values({ title, content, authorId: userId }); */
 console.log({ title, content });
}
