"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col relative">
      
      {/* Top Navbar */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4">
        {/* Left side (optional logo text) */}
        <div className="text-lg font-bold text-gray-200">
          NewsPod
        </div>

        {/* Right side Login button */}
        <Link href="/login">
          <Button
            size="sm"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        {/* Sleek Moving Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-6 flex justify-center"
        >
          <video
            src="/Newspod.webm"
            autoPlay
            loop
            muted
            playsInline
            className="w-48 md:w-64 rounded-xl shadow-2xl border border-gray-700 bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Animated Text */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        >
          Nagpur News AI Podcaster
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-lg md:text-2xl text-gray-300 max-w-2xl mb-8"
        >
          Stay updated with the latest Nagpur news. AI-powered, natural voice,
          real-time updates.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex gap-4"
        >
          <Button
            size="lg"
            className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg"
          >
            <PlayCircle className="mr-2 h-6 w-6" /> Listen Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-2xl border-gray-500 text-lg hover:bg-gray-200"
          >
            <Sparkles className="mr-2 h-6 w-6 text-gray-500" />
            <span className="text-gray-500">Explore</span>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-gray-950">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Mic className="h-10 w-10 text-blue-400" />,
              title: "AI Narration",
              desc: "Crystal clear AI-generated voices bringing news to life.",
            },
            {
              icon: <Sparkles className="h-10 w-10 text-purple-400" />,
              title: "Real-time Updates",
              desc: "Get the latest Nagpur news without delays.",
            },
            {
              icon: <PlayCircle className="h-10 w-10 text-pink-400" />,
              title: "On-the-go Listening",
              desc: "Stream anywhere, anytime, hands-free.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
            >
              <Card className="bg-gray-800/60 border-gray-700 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{f.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-200">
                    {f.title}
                  </h3>
                  <p className="text-gray-400">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 border-t border-gray-800">
        <p>
          © {new Date().getFullYear()} Nagpur News AI Podcaster. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}