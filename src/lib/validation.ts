import { z } from 'zod';

export const updateProfileSchema = z.object({
 name: z.string().trim().min(1, 'Cannot be empty').max(64, 'Cannot be longer than 64 characters'),
});
export const addGlobalMessageSchema = z.object({
 content: z.string(),
});
export const createPostSchema = z.object({
 title: z.string().trim().min(10, 'Post title should be at least 10 characters long!'),
 content: z.string().trim().min(500, 'Post content has to be atleast 500 characters long!'),
 /*  tags: z.array(z.string()).optional(), */
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export type AddGlobalMessageValues = z.infer<typeof addGlobalMessageSchema>;
export type CreatePostValues = z.infer<typeof createPostSchema>;
