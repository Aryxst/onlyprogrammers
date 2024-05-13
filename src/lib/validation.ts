import { z } from 'zod';

export const updateProfileSchema = z.object({
 name: z.string().trim().min(1, 'Cannot be empty').max(64, 'Cannot be longer than 64 characters'),
});
export const addGlobalMessageSchema = z.object({
 content: z.string(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export type addGlobalMessageValues = z.infer<typeof addGlobalMessageSchema>;
