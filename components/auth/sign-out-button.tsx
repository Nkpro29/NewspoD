"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }
  return (
    <Button
      size="sm"
      className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
    >
      logout
    </Button>
  );
}
