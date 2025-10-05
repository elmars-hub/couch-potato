"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, Bookmark } from "lucide-react";
import { ProfileForm } from "@/components/profile/profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl, getInitials } from "@/lib/avatar";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
            <div className="h-60 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-white/60">Manage your account and preferences</p>
          </div>

          {/* Profile Update Form */}
          <ProfileForm user={user} />

          <div className="flex items-center justify-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={getAvatarUrl(user.email, 64)} alt={`${user.name || user.email}'s avatar`} />
              <AvatarFallback className="text-lg">{getInitials(user.name, user.email)}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-semibold">{user.name || "User"}</p>
              <p className="text-sm text-white/60">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Favorites
                </CardTitle>
                <CardDescription>
                  Your favorite movies and TV shows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/profile/likes">View Likes</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5" />
                  Watchlist
                </CardTitle>
                <CardDescription>
                  Movies and shows to watch later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/watchlist">View Watchlist</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          

          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
