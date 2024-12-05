'use client';
import { signIn } from 'next-auth/react';
import { Button, type ButtonProps } from './ui/button';

export default function SignInButton(props: ButtonProps) {
 return (
  <Button onClick={() => signIn('github')} {...props}>
   Sign in
  </Button>
 );
}
