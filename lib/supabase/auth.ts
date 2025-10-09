// lib/supabase/auth.ts
import { createClient } from "./server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser(token?: string) {
  const supabase = await createClient();

  // Get user from Supabase Auth
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser(token);

  if (!authUser) {
    return null;
  }

  try {
    // Get user from Neon database
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    // If user doesn't exist in Neon, create it
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || null,
          avatarUrl: authUser.user_metadata?.avatar_url || null,
        },
      });
      return newUser;
    }

    return user;
  } catch (error: any) {
    // Surface Prisma connection issues cleanly to API layer
    const err = new Error("DB_UNAVAILABLE");
    (err as any).cause = error;
    throw err;
  }
}
