// app/api/watchlist/route.ts
// Same structure as favorites, just replace 'favorite' with 'watchlist'
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const user = await getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(watchlist);
  } catch (err: any) {
    if (err?.message === "DB_UNAVAILABLE") {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const user = await getCurrentUser(token);
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
  } catch (err: any) {
    if (err?.message === "DB_UNAVAILABLE") {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const user = await getCurrentUser(token);
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
  } catch (err: any) {
    if (err?.message === "DB_UNAVAILABLE") {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
