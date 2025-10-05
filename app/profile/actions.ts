"use server"

import { createClient } from "@/lib/supabase/server"

export async function saveProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const displayName = formData.get("displayName")
  const bio = formData.get("bio")

  await supabase
    .from("profiles")
    .upsert(
      {
        user_id: user.id,
        display_name: typeof displayName === "string" ? displayName : "",
        bio: typeof bio === "string" ? bio : "",
      },
      { onConflict: "user_id" }
    )
}
