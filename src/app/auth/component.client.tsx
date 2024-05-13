'use client';

import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
 const searchParams = useSearchParams();
 const callbackUrl = searchParams.get('callbackUrl') || '/settings';

 return (
  <div>
   <Button size='lg' onClick={() => signIn('github', { callbackUrl })}>
    <Github />
    Continue with GitHub
   </Button>
  </div>
 );
}
