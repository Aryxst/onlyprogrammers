import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, primaryKey, integer, int } from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';
import { createId } from '@paralleldrive/cuid2';
import { globalMessage } from './message';
import { post } from './post';

export const user = sqliteTable('user', {
 id: text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => createId()),
 name: text('name'),
 email: text('email').notNull(),
 emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
 image: text('image'),
 role: text('role').$type<'USER' | 'ADMIN'>().notNull().default('USER'),
 joinedAt: integer('joinedAt', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
});

export const userRelations = relations(user, ({ many }) => ({
 posts: many(post),
 globalMessages: many(globalMessage),
}));

export const account = sqliteTable(
 'account',
 {
  userId: text('userId')
   .notNull()
   .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').$type<AdapterAccountType>().notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
 },
 account => ({
  compoundKey: primaryKey({
   columns: [account.provider, account.providerAccountId],
  }),
 }),
);

export const session = sqliteTable('session', {
 sessionToken: text('sessionToken').notNull().primaryKey(),
 userId: text('userId')
  .notNull()
  .references(() => user.id, { onDelete: 'cascade' }),
 expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const VerificationToken = sqliteTable(
 'verificationToken',
 {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
 },
 vt => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 }),
);
