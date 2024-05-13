import type { Metadata } from 'next';
import SettingsPage from './component.client';
import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
 title: 'Only Programmers - Settings',
};
export default async function Page() {
 const session = await getSession();
 const user = session?.user;

 if (!user) {
  redirect('/auth?callbackUrl=/settings');
 }

 return <SettingsPage user={user} />;
}
