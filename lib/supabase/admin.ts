// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

// Uses service role: never expose to the browser
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // add this env var
  );
}
