import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function LoginPage() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-pretty">Welcome back</h1>
        <p className="text-muted-foreground">Log in to access your dashboard.</p>
      </div>
      <AuthForm mode="login" />
      <p className="text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link className="underline underline-offset-4" href="/signup">
          Sign up
        </Link>
      </p>
    </main>
  )
}
