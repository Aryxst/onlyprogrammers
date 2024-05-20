'use client';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { type CreatePostValues, createPostSchema } from '@/lib/validation';
import { createPost } from './actions';
import { toast } from 'sonner';

export default function Client() {
 const form = useForm<CreatePostValues>({
  resolver: zodResolver(createPostSchema),
  defaultValues: { title: '', content: '' },
 });

 async function onSubmit(data: CreatePostValues) {
  await createPost(data);
  toast.success('Successfully created new post!');
 }

 return (
  <FormProvider {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-full space-y-2.5'>
    <FormField
     name='title'
     control={form.control}
     render={({ field }) => (
      <FormItem>
       <FormLabel>Name</FormLabel>
       <FormControl>
        <Input placeholder='Enter post name' className='mt-3' {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <FormField
     name='content'
     control={form.control}
     render={({ field }) => (
      <FormItem>
       <FormLabel>Content</FormLabel>
       <FormControl>
        <Textarea placeholder='Enter post content' className='mt-3 min-h-[50vh]' {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <Button type='submit' disabled={form.formState.isSubmitting}>
     Submit
    </Button>
   </form>
  </FormProvider>
 );
}
