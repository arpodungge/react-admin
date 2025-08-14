import { z } from 'zod';
import { user } from '../lib/db/schema/system';
import { sql } from 'drizzle-orm';
import { db } from '../lib/db';

export const userRegistrationSchema = z.object({
  username: z.string().nonempty("username is required")
  .refine(async (username) => {
    const existing = await db
      .select()
      .from(user)
      .where(sql`${user.username} = ${username}`);
    return existing.length === 0
  },{
    message: "username already exists",
  }),
  fullname: z.string().nonempty("fullname is required"),
  password: z.string().nonempty("password is required").min(6),
});

export const userLoginSchema = z.object({
  username: z.string().nonempty("username is required"),
  password: z.string().nonempty("password is required"),
});