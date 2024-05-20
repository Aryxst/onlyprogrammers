import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { user } from './user';

export const post = sqliteTable('post', {
 id: text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => createId()),
 authorId: text('authorId')
  .notNull()
  .references(() => user.id, { onDelete: 'cascade' }),
 title: text('title').notNull(),
 content: text('content').notNull(),
 tags: text('tags', { mode: 'json' })
  .notNull()
  .$type<string[]>()
  .default(sql`(json_array())`),
 createdAt: integer('createdAt', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
});

export const postRelations = relations(post, ({ one, many }) => ({
 author: one(user, {
  fields: [post.authorId],
  references: [user.id],
 }),
 comments: many(postComment),
}));

export const postComment = sqliteTable('postComment', {
 id: text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => createId()),
 content: text('content').notNull(),
 createdAt: integer('createdAt', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
 authorId: text('authorId').notNull(),
 postId: integer('postId').references(() => post.id, { onDelete: 'cascade' }),
});

export const postCommentRelations = relations(postComment, ({ one }) => ({
 post: one(post, {
  fields: [postComment.postId],
  references: [post.id],
 }),
}));
