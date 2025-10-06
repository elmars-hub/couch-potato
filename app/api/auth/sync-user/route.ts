// app/api/auth/sync-user/route.ts

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { User as PrismaUser } from "@prisma/client";

async function syncUser() {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!authUser.email) {
      return NextResponse.json(
        { error: "User email missing" },
        { status: 400 }
      );
    }

    const updates = {
      email: authUser.email,
      ...(authUser.user_metadata?.name && {
        name: authUser.user_metadata.name,
      }),
      ...(authUser.user_metadata?.avatar_url && {
        avatarUrl: authUser.user_metadata.avatar_url,
      }),
    };

    const user = await prisma.user.upsert({
      where: { id: authUser.id },
      update: updates,
      create: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || null,
        avatarUrl: authUser.user_metadata?.avatar_url || null,
      },
    });

    return NextResponse.json<{ user: PrismaUser }>({ user });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      {
        error: "Failed to sync user",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return syncUser();
}

// optional, if you want GET for debugging only
export async function GET() {
  return syncUser();
}
