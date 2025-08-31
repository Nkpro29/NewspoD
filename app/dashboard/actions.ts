"use server";

import { prisma } from "@/lib/prisma";
import { getServerSupabase } from "@/lib/supabase/server";
import { play } from "@elevenlabs/elevenlabs-js";
import { revalidatePath } from "next/cache";

export async function saveProfile(formData: FormData) {
  const supabase = getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  const displayName = (formData.get("displayName") as string | null) || null;
  const bio = (formData.get("bio") as string | null) || null;

  await supabase
    .from("Profile")
    .update({ displayName, bio })
    .eq("userId", user.id)
    .select("*");

  revalidatePath("/dashboard");
}

// Generate audio for an episode via ElevenLabs and just play it (no storage)
export async function generateEpisodeAudio(formData: FormData) {
  const supabase = getServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Unauthorized");

  const episodeId = String(formData.get("episodeId") || "").trim();
  if (!episodeId) throw new Error("episodeId is required");

  // Fetch episode
  const { data: episode, error: episodeError } = await supabase
    .from("Episode")
    .select("*")
    .eq("id", episodeId)
    .single();

  if (episodeError || !episode) throw new Error("Episode not found");
  if (!episode.script || episode.script.trim().length === 0) {
    throw new Error("Episode has no script to synthesize");
  }

  // Update status to PROCESSING
  await supabase.from("Episode").update({ status: "PROCESSING" }).eq("id", episodeId);

  // ElevenLabs
  const { ElevenLabsClient } = await import("@elevenlabs/elevenlabs-js");
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
  const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
  const outputFormat = (process.env.ELEVENLABS_OUTPUT ||
    "mp3_44100_128") as any;

  const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
  });

  try {
    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text: episode.script,
      modelId,
      outputFormat,
    });

    // Directly play the generated audio
    await play(audio);

    // Mark as published
    await prisma.episode.update({
      where: { id: episodeId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
  } catch (error) {
    console.error(error);
    await prisma.episode.update({
      where: { id: episodeId },
      data: { status: "FAILED" },
    });
    throw error;
  }

  revalidatePath("/dashboard");
}
