'use client';
import { addGlobalMessageSchema, type addGlobalMessageValues } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { addGlobalMessage, deleteGlobalMessage } from './actions';
import { useEffect } from 'react';
import { Ellipsis, Flag, Trash2 } from 'lucide-react';
import { MessageType } from './page';

export function Action({ action }: { action: () => any }) {
 useEffect(() => {
  action();
 }, [action]);
 return null;
}

export default function ClientComponent() {
 const form = useForm<addGlobalMessageValues>({
  resolver: zodResolver(addGlobalMessageSchema),
  defaultValues: { content: '' },
 });

 async function onSubmit(data: addGlobalMessageValues) {
  try {
   await addGlobalMessage(data);
  } catch (err) {
   console.log(err);
  }
 }
 return (
  <Form {...form}>
   <form onSubmit={form.handleSubmit(onSubmit)} className='max-w-full space-y-2.5'>
    <FormField
     control={form.control}
     name='content'
     render={({ field }) => (
      <FormItem>
       <FormControl>
        <Textarea placeholder='Enter your message' autoFocus {...field} />
       </FormControl>
       <FormMessage />
      </FormItem>
     )}
    />
    <Button type='submit' disabled={form.formState.isSubmitting}>
     Submit
    </Button>
   </form>
  </Form>
 );
}
type MessageInteractionDropdownProps = {
 message: MessageType;
 isMessageAuthor: boolean;
 isAdmin: boolean;
};
export function MessageInteractionDropdown(props: MessageInteractionDropdownProps) {
 return (
  <DropdownMenu>
   <DropdownMenuTrigger>
    <Ellipsis width={16} />
   </DropdownMenuTrigger>
   <DropdownMenuContent className='p-2'>
    {(props.isMessageAuthor || props.isAdmin) && (
     <DropdownMenuItem
      className='flex flex-row items-center gap-4'
      onClick={() => {
       /* if (confirm('Are you sure you want to delete this message?'))  */
       deleteGlobalMessage(props.message.id, props.message.authorId);
      }}
     >
      <Trash2 width={20} />
      <span>Delete</span>
     </DropdownMenuItem>
    )}
    <DropdownMenuItem className='flex flex-row items-center gap-4'>
     <Flag width={20} />
     <span>Report</span>
    </DropdownMenuItem>
   </DropdownMenuContent>
  </DropdownMenu>
 );
}
