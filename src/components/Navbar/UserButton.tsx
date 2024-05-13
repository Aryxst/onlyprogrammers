'use client';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Lock, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { ExtendedUser } from '@/types/next-auth';

interface Props {
 user: ExtendedUser;
}

export default function UserButton({ user }: Props) {
 return (
  <DropdownMenu>
   <DropdownMenuTrigger asChild>
    <Button size='icon' className='flex-none rounded-full'>
     <Image src={user.image!} alt='User profile picture' width={50} height={50} className='aspect-square rounded-full bg-background object-cover' />
    </Button>
   </DropdownMenuTrigger>
   <DropdownMenuContent className='w-56'>
    <DropdownMenuLabel>{user.name || 'User'}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
     <DropdownMenuItem asChild>
      <Link href='/settings'>
       <Settings className='mr-2 h-4 w-4' />
       <span>Settings</span>
      </Link>
     </DropdownMenuItem>
     {user.role === 'ADMIN' && (
      <DropdownMenuItem asChild>
       <Link href='/admin'>
        <Lock className='mr-2 h-4 w-4' />
        Admin
       </Link>
      </DropdownMenuItem>
     )}
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
     <button onClick={() => signOut({ callbackUrl: '/' })} className='flex w-full items-center'>
      <LogOut className='mr-2 h-4 w-4' /> Sign Out
     </button>
    </DropdownMenuItem>
   </DropdownMenuContent>
  </DropdownMenu>
 );
}
