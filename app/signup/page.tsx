import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function SignupPage() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-pretty">Create your account</h1>
        <p className="text-muted-foreground">Get started with the dashboard in minutes.</p>
      </div>
      <AuthForm mode="signup" />
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link className="underline underline-offset-4" href="/login">
          Log in
        </Link>
      </p>
    </main>
  )
}
