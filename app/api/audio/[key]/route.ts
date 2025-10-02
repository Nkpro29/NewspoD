import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string } }
) {
  const supabase = await createServerSupabase();
  const bucket = process.env.NEXT_PUBLIC_EPISODES_BUCKET || "episodes";
  const key = params.key;

  const { data, error } = await supabase.storage
    .from(bucket)
    .download(key);

  if (error || !data) {
    return new NextResponse("Audio not found", { status: 404 });
  }

  const arrayBuffer = await data.arrayBuffer();
  return new NextResponse(Buffer.from(arrayBuffer), {
    headers: {
      "Content-Type": "audio/wav",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  });
}