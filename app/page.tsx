import { AuthHeader } from "@/components/auth/auth-header";
import { AuthContent } from "@/components/auth/auth-content";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AuthHeader />
      <AuthContent />
    </div>
  );
}
