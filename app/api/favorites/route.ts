// app/api/favorites/route.ts (Enhanced version with better error handling)
import { getCurrentUser } from "@/lib/supabase/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all favorites for current user
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

// POST add to favorites
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const user = await getCurrentUser(token);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { mediaType, mediaId } = body;

    console.log("Adding to favorites:", {
      userId: user.id,
      mediaType,
      mediaId,
    });

    // Validate mediaType
    if (!mediaType || (mediaType !== "movie" && mediaType !== "tv")) {
      return NextResponse.json(
        { error: "Invalid mediaType. Must be 'movie' or 'tv'" },
        { status: 400 }
      );
    }

    // Convert mediaId to number
    const mediaIdNumber =
      typeof mediaId === "number" ? mediaId : parseInt(mediaId, 10);

    if (isNaN(mediaIdNumber)) {
      return NextResponse.json(
        { error: "Invalid mediaId. Must be a number" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_mediaType_mediaId: {
          userId: user.id,
          mediaType,
          mediaId: mediaIdNumber,
        },
      },
    });

    if (existing) {
      console.log("Already in favorites:", existing);
      return NextResponse.json(
        { error: "Already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        mediaType,
        mediaId: mediaIdNumber,
      },
    });

    console.log("Favorite created:", favorite);
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return NextResponse.json(
      {
        error: "Failed to add to favorites",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE remove from favorites
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

    console.log("Removing from favorites:", {
      userId: user.id,
      mediaType,
      mediaId,
    });

    if (!mediaType || !mediaId) {
      return NextResponse.json(
        { error: "Missing parameters: mediaType and mediaId are required" },
        { status: 400 }
      );
    }

    const result = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        mediaType,
        mediaId: parseInt(mediaId),
      },
    });

    console.log("Delete result:", result);
    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
