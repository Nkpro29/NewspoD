import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background video (same as login page) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      >
        <source src="/Newspod.webm" type="video/webm" />
        <source src="/Newspod.mp4" type="video/mp4" />
      </video>

      {/* Overlay for dark theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-black/70 p-8 shadow-lg backdrop-blur-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        </div>

        <AuthForm mode="login" />

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link className="font-medium text-blue-400 hover:underline" href="/signup">
            Signup
          </Link>
        </p>
      </div>
    </main>
  )
}