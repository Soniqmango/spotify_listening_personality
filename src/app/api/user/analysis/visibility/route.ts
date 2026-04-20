import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { isPublic } = await req.json();
  if (typeof isPublic !== "boolean") {
    return NextResponse.json({ error: "isPublic must be a boolean" }, { status: 400 });
  }

  const db = getServiceClient();
  const { error } = await db
    .from("analyses")
    .update({ is_public: isPublic })
    .eq("spotify_id", session.spotifyId)
    .order("analyzed_at", { ascending: false })
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
