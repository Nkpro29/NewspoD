"use server";

import Groq from "groq-sdk";
import { SpeechResult } from "@/lib/types";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// Lazy-initialize server-side Supabase client to avoid top-level await issues
let supabasePromise: ReturnType<typeof createServerSupabase> | null = null;
async function getSupabase() {
  if (!supabasePromise) {
    supabasePromise = createServerSupabase();
  }
  return supabasePromise;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const model = "playai-tts";
const voice = "Fritz-PlayAI";
const responseFormat = "wav";

export async function generateSpeech(text: string): Promise<SpeechResult> {
  // Request TTS audio from Groq and return raw bytes to the caller
  const response = await groq.audio.speech.create({
    model,
    voice,
    input: text,
    response_format: responseFormat,
  });

  const audio = await response.arrayBuffer();

  return {
    audio,
    contentType: "audio/wav",
    fileName: "speech.wav",
  };
}

// Generate speech, upload to Supabase Storage, and return a URL using your deploy domain
export async function generateAndUploadSpeech(
  text: string
): Promise<{ url: string; key: string }> {
  const response = await groq.audio.speech.create({
    model,
    voice,
    input: text,
    response_format: responseFormat,
  });

  const audio = await response.arrayBuffer();
  const fileBuffer = Buffer.from(audio);

  const bucket = process.env.NEXT_PUBLIC_EPISODES_BUCKET as string;
  const key = `${randomUUID()}.wav`;

  const admin = createAdminClient();

  const { error: uploadError } = await admin.storage
    .from(bucket)
    .upload(key, fileBuffer, {
      cacheControl: "3600",
      contentType: "audio/wav",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload audio: ${uploadError.message}`);
  }

  // ✅ Permanent public URL (works only if bucket is public)
  const { data } = await admin.storage.from(bucket).getPublicUrl(key);

  return {
    url: data.publicUrl,
    key,
  };
}

export async function publishAudioUrl(audio_url: string, episodeId: string) {
  const supabase = await getSupabase();

  try {
    const { data } = await supabase
      .from("Episode")
      .update({
        audioUrl: audio_url,
        title: "Local News",
        description: "This is a Nagpur news podcast.",
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "PUBLISHED",
      })
      .eq("id", episodeId)
      .select();

    console.log("published audio url: ", data);
  } catch (error) {
    console.error(error);
  }
}
