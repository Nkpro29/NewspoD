import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getServerSupabase } from "@/lib/supabase/server";
import { saveProfile } from "../dashboard/actions";

export default async function ProfilePage() {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // const profile = await prisma.profile.findUnique({
  //   where: { userId: user.id },
  // });
  return (
    <>
      <main className="relative min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        <section className="grid gap-8 md:grid-cols-2 flex h-full px-10 py-20 flex-row justify-center items-center">
          <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-md shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Your Profile
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your display name and bio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={saveProfile} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="displayName"
                    className="text-sm font-medium text-gray-200"
                  >
                    Display Name
                  </label>
                  <Input
                    id="displayName"
                    name="displayName"
                    defaultValue={""}
                    className="bg-gray-800/70 border-gray-700 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-200"
                  >
                    Bio
                  </label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={""}
                    rows={4}
                    className="bg-gray-800/70 border-gray-700 text-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                >
                  Save changes
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-md shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">
                Account
              </CardTitle>
              <CardDescription className="text-gray-400">
                Basic information from Supabase Auth.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-gray-300">
              <div className="text-sm">
                <span className="font-medium text-gray-200">Email:</span>{" "}
                {user.email}
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-200">User ID:</span>{" "}
                {user.id}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
