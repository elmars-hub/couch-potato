// app/api/users/me/route.ts
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createClient();

  // 🔹 Check for Authorization header (client-side requests)
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  const {
    data: { user: authUser },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !authUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // 🔹 Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
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
