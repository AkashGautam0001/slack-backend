import { z } from 'zod';

export const workspaceSchema = z.object({
  name: z.string().min(3).max(50)
});

export const addMemberToWorkspaceSchema = z.object({
  memberId: z.string(),
  role: z.enum(['admin', 'member'])
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string().min(3).max(50)
});
