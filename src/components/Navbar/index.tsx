'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import UserButton from './UserButton';
import SignInButton from '@/components/SignInButton';

export default function Navbar() {
 const session = useSession();
 const user = session.data?.user;

 return (
  <header className='sticky top-0 bg-background px-3 shadow-sm'>
   <nav className='mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3'>
    <Link href='/' className='text-xl font-bold uppercase tracking-wider'>
     OnlyProgrammers
    </Link>
    {user && <UserButton user={user} />}
    {!user && session.status !== 'loading' && <SignInButton />}
   </nav>
  </header>
 );
}
