"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { getBrowserSupabase } from "@/lib/supabase/client"

export function SignOutButton() {
  const router = useRouter()
  async function onSignOut() {
    const supabase = getBrowserSupabase()
    await supabase.auth.signOut()
    router.push("/login")
  }
  return (
    <Button variant="outline" onClick={onSignOut}>
      Sign out
    </Button>
  )
}
