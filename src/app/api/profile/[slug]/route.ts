import { NextResponse } from "next/server";
import { getAnalysisBySlug, getTopTracksForAnalysis } from "@/lib/db/queries";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const analysis = await getAnalysisBySlug(params.slug);
  if (!analysis) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const topTracks = await getTopTracksForAnalysis(analysis.id);
  return NextResponse.json({ analysis, topTracks });
}
