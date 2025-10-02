// components/episodes/generate-audio-button.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  generateAndUploadSpeech,
  publishAudioUrl,
} from "@/app/dashboard/actions";

export default function GenerateAudioButton({
  episodeId,
  text,
}: {
  episodeId: string;
  text: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      // Generate TTS and upload to Supabase; receive a URL hosted under your deploy domain
      const { url } = await generateAndUploadSpeech(text);
      console.log("Generated and uploaded audio for episode:", episodeId, url);

      // Save the URL in your DB
      const pusblishAudioUrlResponse = await publishAudioUrl(url, episodeId);
      console.log(pusblishAudioUrlResponse);
    });
  };

  return (
    <Button
      size="sm"
      className="rounded-lg bg-purple-600 hover:bg-purple-700 transition"
      onClick={handleGenerate}
      disabled={isPending}
    >
      {isPending ? "Generating..." : "Generate audio"}
    </Button>
  );
}
