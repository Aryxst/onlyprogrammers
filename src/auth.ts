import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import db, { user } from '@/db';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
 trustHost: true,
 theme: {
  logo: 'https://avatars.githubusercontent.com/u/101392520?v=4',
 },
 adapter: DrizzleAdapter(db),
 providers: [
  Github({
   clientId: process.env.AUTH_GITHUB_ID!,
   clientSecret: process.env.AUTH_GITHUB_SECRET!,
  }),
 ],
 session: {
  strategy: 'jwt',
 },
 callbacks: {
  async session({ session, token }) {
   if (token.sub && session.user) {
    session.user.id = token.sub;
   }
   if (token.role && session.user) {
    session.user.role = token.role;
   }

   return session;
  },
  async jwt({ token, trigger, session }) {
   if (!token.sub) return token;

   if (trigger == 'update') {
    return {
     ...token,
     name: session.user.name,
    };
   }

   const existingUser = await db.query.user.findFirst({
    where: eq(user.id, token.sub),
   });

   if (!existingUser) return token;
   token.role = existingUser.role;

   return token;
  },
 },
});
