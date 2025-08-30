import { redirect } from "next/navigation"
import { getServerSupabase } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { saveProfile, generateEpisodeAudio } from "./actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/auth/sign-out-button"

import { AudioPlayer } from "@/components/audio-player"

export default async function DashboardPage() {
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } })

  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col gap-8 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-pretty">Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {profile?.displayName || user.email}</p>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Your Profile</CardTitle>
            <CardDescription>Update your display name and bio.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={saveProfile} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <label htmlFor="displayName" className="text-sm font-medium">
                  Display Name
                </label>
                <Input id="displayName" name="displayName" defaultValue={profile?.displayName ?? ""} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </label>
                <Textarea id="bio" name="bio" defaultValue={profile?.bio ?? ""} rows={4} />
              </div>
              <div>
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pretty">Account</CardTitle>
            <CardDescription>Basic information from Supabase Auth.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="text-sm">
              <span className="font-medium">Email:</span> {user.email}
            </div>
            <div className="text-sm">
              <span className="font-medium">User ID:</span> {user.id}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Episodes list with audio player */}
      <section className="grid gap-6">
        <EpisodesList />
      </section>
    </main>
  )
}

// Server Component to list episodes and provide audio players
async function EpisodesList() {
  const episodes = await prisma.episode.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty">Your Episodes</CardTitle>
        <CardDescription>Listen to your generated news episodes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {episodes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No episodes yet. Generate one to get started.</p>
        ) : (
          <ul className="space-y-6">
            {episodes.map((ep) => (
              <li key={ep.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">{ep.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ep.createdAt).toLocaleString()} • {ep.status}
                      {ep.duration ? ` • ${Math.round(ep.duration / 60)} min` : ""}
                    </p>
                  </div>
                </div>
                {ep.description ? (
                  <p className="mb-3 text-sm text-muted-foreground">{ep.description}</p>
                ) : null}
                {ep.audioUrl ? (
                  <AudioPlayer src={ep.audioUrl} presetDuration={ep.duration ?? null} />
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-amber-600">Audio not ready. Current status: {ep.status}</p>
                    <form action={generateEpisodeAudio}>
                      <input type="hidden" name="episodeId" value={ep.id} />
                      <Button type="submit" size="sm">Generate audio</Button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
