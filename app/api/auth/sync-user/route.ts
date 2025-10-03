// app/api/auth/sync-user/route.ts

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

async function syncUser() {
  try {
    const supabase = await createClient();

    // Get the authenticated user from Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if user already exists in Neon database
    const existingUser = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create user in Neon database with same ID as Supabase
    const newUser = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || null,
        avatarUrl: authUser.user_metadata?.avatar_url || null,
      },
    });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}

export async function GET() {
  return syncUser();
}

export async function POST() {
  return syncUser();
}
