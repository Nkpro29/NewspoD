import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { saveProfile, generateEpisodeAudio } from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "@/components/audio-player";
import UserAvatar from "@/components/auth/user-avatar";

export default async function DashboardPage() {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

      <div className="relative z-10 container mx-auto flex flex-col gap-12 p-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome, {profile?.displayName || user.email}
            </p>
          </div>
          {/* Avatar dropdown */}
          <UserAvatar user={{ email: user.email! }} />
        </header>

        {/* Episodes list */}
        <section>
          <EpisodesList />
        </section>
      </div>
    </main>
  );
}

async function EpisodesList() {
  const episodes = await prisma.episode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-md shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white">
          Your Episodes
        </CardTitle>
        <CardDescription className="text-gray-400">
          Listen to your generated news episodes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {episodes.length === 0 ? (
          <p className="text-sm text-gray-500">
            No episodes yet. Generate one to get started.
          </p>
        ) : (
          <ul className="space-y-6">
            {episodes.map((ep) => (
              <li
                key={ep.id}
                className="rounded-xl border border-gray-800 bg-gray-800/50 p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{ep.title}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(ep.createdAt).toLocaleString()} • {ep.status}
                      {ep.duration
                        ? ` • ${Math.round(ep.duration / 60)} min`
                        : ""}
                    </p>
                  </div>
                </div>
                {ep.description ? (
                  <p className="mb-3 text-sm text-gray-400">{ep.description}</p>
                ) : null}
                {ep.audioUrl ? (
                  <AudioPlayer
                    src={ep.audioUrl}
                    presetDuration={ep.duration ?? null}
                  />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-amber-400">
                      Audio not ready. Current status: {ep.status}
                    </p>
                    <form action={generateEpisodeAudio}>
                      <input type="hidden" name="episodeId" value={ep.id} />
                      <Button
                        type="submit"
                        size="sm"
                        className="rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                      >
                        Generate audio
                      </Button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
