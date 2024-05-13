import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { user } from './user';

export const globalMessage = sqliteTable('globalMessage', {
 id: text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => createId()),
 content: text('content').notNull(),
 createdAt: integer('createdAt', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
 authorId: text('authorId')
  .notNull()
  .references(() => user.id, { onDelete: 'cascade' }),
});

export const globalMessageRelations = relations(globalMessage, ({ one }) => ({
 author: one(user, {
  fields: [globalMessage.authorId],
  references: [user.id],
 }),
}));

export const globalMessageComment = sqliteTable('globalMessageComment', {
 id: text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => createId()),
 content: text('content').notNull(),
 createdAt: integer('createdAt', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
 authorId: text('authorId').notNull(),
 globalMessageId: integer('globalMessageId')
  .notNull()
  .references(() => globalMessage.id, { onDelete: 'cascade' }),
});

export const globalMessageCommentRelations = relations(globalMessageComment, ({ one }) => ({
 post: one(globalMessage, {
  fields: [globalMessageComment.globalMessageId],
  references: [globalMessage.id],
 }),
}));
