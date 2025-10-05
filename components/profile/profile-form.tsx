"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";
import { getAvatarUrl, getInitials } from "@/lib/avatar";
import { User } from "lucide-react";

interface ProfileFormProps {
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [submitting, setSubmitting] = useState(false);
  const { updateProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === user.name) {
      toast("No changes to save", { icon: "ℹ️" });
      return;
    }

    try {
      setSubmitting(true);
      const { error: updateError } = await updateProfile({ name });
      if (updateError) {
        toast.error(updateError.message || "Failed to update profile");
      } else {
        toast.success("Profile updated successfully");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName(user.name || "");
    toast.dismiss();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Update your display name
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Avatar Display */}
        <div className="flex items-center justify-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage 
              src={getAvatarUrl(user.email, 80)} 
              alt={`${user.name || user.email}'s avatar`}
            />
            <AvatarFallback className="text-lg">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">Avatar generated from email</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your display name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="flex gap-2 items-center justify-center">
            <Button type="submit" disabled={submitting} className={`bg-red-600 hover:bg-red-700 ${submitting ? "opacity-80" : ""}`}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={submitting}>
              Reset
            </Button>
          </div>
        </form>

      </CardContent>
    </Card>
  );
}
