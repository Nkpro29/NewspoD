// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AudioPlayer } from "@/components/audio-player";
import UserAvatar from "@/components/auth/user-avatar";
import GenerateAudioButton from "@/components/episodes/generate-audio-button"; // 👈 new client component

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: role } = await supabase.from("Profile").select("role");

  console.log(role);

  if (!user) {
    redirect("/login");
  }

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
            <p className="text-gray-400">Welcome, {user.email}</p>
          </div>
          {/* Avatar dropdown */}
          <UserAvatar user={{ email: user.email! }} />
        </header>

        {/* Episodes list */}
        <section>
          <EpisodesList userRole={role?.[0]?.role || "USER"} />
        </section>
      </div>
    </main>
  );
}

async function EpisodesList({ userRole }: { userRole: string }) {
  const supabase = await createClient();
  const { data: Episode } = await supabase.from("Episode").select("*");

  const episodes =
    Episode?.map((episode) => ({
      id: episode.id,
      title: episode.title,
      description: episode.description,
      createdAt: episode.createdAt,
      publishedAt: episode.publishedAt,
      duration: episode.duration,
      audioUrl: episode.audioUrl,
      script: episode.script,
      status: episode.status,
    })) || [];

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
                      {ep.status === "PUBLISHED"
                        ? new Date(ep.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : new Date(ep.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                      • {ep.status}
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
                    {ep.script &&
                    ep.status !== "PUBLISHED" &&
                    userRole === "ADMIN" ? (
                      <GenerateAudioButton
                        episodeId={ep.id}
                        text={ep.script ?? ""}
                      />
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No script available
                      </p>
                    )}
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
