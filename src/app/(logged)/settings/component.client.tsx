'use client';
import { useSession } from 'next-auth/react';
import { UpdateProfileValues, updateProfileSchema } from '@/lib/validation';
import { ExtendedUser } from '@/types/next-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { updateProfile } from './actions';

interface Props {
 user: ExtendedUser;
}

export default function SettingsPage({ user }: Props) {
 const session = useSession();
 const form = useForm<UpdateProfileValues>({
  resolver: zodResolver(updateProfileSchema),
  defaultValues: { name: user.name || '' },
 });
 async function onSubmit(data: UpdateProfileValues) {
  try {
   await updateProfile(data);
   await session.update({ ...session, user: { ...session.data?.user, name: data.name } });
  } catch (err) {
   console.log(err);
  }
 }
 return (
  <main className='px-3 py-10'>
   <section className='mx-auto max-w-7xl space-y-6'>
    <h1 className='text-3xl font-bold'>Settings</h1>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-sm space-y-2.5'>
      <FormField
       control={form.control}
       name='name'
       render={({ field }) => (
        <FormItem>
         <FormLabel>Name</FormLabel>
         <FormControl>
          <Input placeholder='Enter a username' autoComplete='off' {...field} />
         </FormControl>
         <FormDescription>Your public username</FormDescription>
         <FormMessage />
        </FormItem>
       )}
      />
      <Button type='submit' disabled={form.formState.isSubmitting}>
       Submit
      </Button>
     </form>
    </Form>
   </section>
  </main>
 );
}
