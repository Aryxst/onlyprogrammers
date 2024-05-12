import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';

export const { handlers, auth } = NextAuth({
 adapter: DrizzleAdapter(db),
 providers: [
  Github({
   clientId: process.env.AUTH_GITHUB_ID!,
   clientSecret: process.env.AUTH_GITHUB_SECRET!,
  }),
 ],
});
