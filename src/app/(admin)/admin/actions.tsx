'use server';
import { revalidateTag } from 'next/cache';

export async function revalidateGlobalMessages() {
 revalidateTag('get-global-messages');
}
