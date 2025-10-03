// app/api/favorites/route.ts
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all favorites for current user
export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(favorites);
}

// POST add to favorites
export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mediaType, mediaId } = await request.json();

  // Check if already favorited
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_mediaType_mediaId: {
        userId: user.id,
        mediaType,
        mediaId,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already in favorites" },
      { status: 400 }
    );
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: user.id,
      mediaType,
      mediaId,
    },
  });

  return NextResponse.json(favorite);
}

// DELETE remove from favorites
export async function DELETE(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("mediaType");
  const mediaId = searchParams.get("mediaId");

  if (!mediaType || !mediaId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      userId: user.id,
      mediaType,
      mediaId: parseInt(mediaId),
    },
  });

  return NextResponse.json({ success: true });
}
