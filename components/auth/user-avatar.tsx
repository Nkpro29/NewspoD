"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Link from "next/link";

export default function UserAvatar({
  user,
}: {
  user: { email: string; image?: string };
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button onClick={() => setOpen(!open)}>
        <Avatar className="cursor-pointer border-2 border-gray-700 hover:border-gray-500 transition bg-gray-200">
          <AvatarImage
            src={user.image || "/default-avatar.png"}
            alt="User Avatar"
          />
          <AvatarFallback>
            {user.email ? user.email[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Modal */}
      {open && (
        <Card className="absolute right-0 w-60 rounded-xl shadow-xl border border-gray-800 bg-gray-900/90 backdrop-blur-md z-50">
          <CardContent className="p-4 space-y-4">
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white truncate">{user.email}</p>
            </div>
            <div className="flex justify-between mt-4">
              <Link href={"/profile"}>
                <Button
                  size="sm"
                  className="rounded-xl text-white bg-gray-900/10 hover:bg-gray-900 border border-gray-200"
                >
                  Profile
                </Button>
              </Link>
              <SignOutButton />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
