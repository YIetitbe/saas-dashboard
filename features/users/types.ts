// features/users/types.ts
import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
})

export type User = z.infer<typeof UserSchema>
