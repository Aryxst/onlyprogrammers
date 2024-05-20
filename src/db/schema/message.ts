import { relations, sql, type InferSelectModel } from 'drizzle-orm';
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
 editedAt: integer('editedAt', { mode: 'timestamp_ms' }),
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

export const globalMessageReport = sqliteTable('globalMessageReport', {
 id: text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => createId()),
 createdAt: integer('createdAt', { mode: 'timestamp_ms' })
  .notNull()
  .default(sql`(unixepoch() * 1000)`),
 offenderId: text('offenderId')
  .notNull()
  .references(() => user.id, { onDelete: 'cascade' })
  .notNull(),
 authorId: text('authorId')
  .notNull()
  .references(() => user.id, { onDelete: 'cascade' }),
 globalMessageId: text('globalMessageId')
  .notNull()
  .references(() => globalMessage.id, { onDelete: 'cascade' }),
});
export type GlobalMessageReportType = InferSelectModel<typeof globalMessageReport>;
export const globalMessageReportRelations = relations(globalMessageReport, ({ one }) => ({
 offender: one(user, {
  fields: [globalMessageReport.offenderId],
  references: [user.id],
 }),
 author: one(user, {
  fields: [globalMessageReport.authorId],
  references: [user.id],
 }),
}));
