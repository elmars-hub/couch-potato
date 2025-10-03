// app/api/watchlist/route.ts
// Same structure as favorites, just replace 'favorite' with 'watchlist'
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(watchlist);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mediaType, mediaId } = await request.json();

  const watchlistItem = await prisma.watchlist.create({
    data: {
      userId: user.id,
      mediaType,
      mediaId,
    },
  });

  return NextResponse.json(watchlistItem);
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mediaType = searchParams.get("mediaType");
  const mediaId = searchParams.get("mediaId");

  await prisma.watchlist.deleteMany({
    where: {
      userId: user.id,
      mediaType: mediaType!,
      mediaId: parseInt(mediaId!),
    },
  });

  return NextResponse.json({ success: true });
}
