'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { revalidateGlobalMessages } from './actions';

export default function Client() {
 return (
  <div>
   <ul className='ml-6 list-disc'>
    <li>
     <Link href='/admin/users'>Users</Link>
    </li>
    <li>
     <Link href='/admin/reports'>Report</Link>
    </li>
   </ul>
   <div>
    <p>Invalidate Global Messages</p>
    <Button
     onClick={async () => {
      if (confirm('Are you sure you want to invalidate global messages cache?')) await revalidateGlobalMessages();
     }}
     size='icon'
     variant='outline'
    >
     <RotateCw />
    </Button>
   </div>
  </div>
 );
}
