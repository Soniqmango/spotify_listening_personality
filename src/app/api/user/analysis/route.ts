import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getLatestAnalysis, getTopTracksForAnalysis } from "@/lib/db/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const analysis = await getLatestAnalysis(session.spotifyId);
  if (!analysis) {
    return NextResponse.json({ analysis: null });
  }

  const topTracks = await getTopTracksForAnalysis(analysis.id);
  return NextResponse.json({ analysis, topTracks });
}
