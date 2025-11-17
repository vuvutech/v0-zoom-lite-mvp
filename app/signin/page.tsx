import { AuthForm } from "@/components/auth-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your ZoomLite account</p>
        </div>
        
        <AuthForm mode="signin" />
        
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:text-primary/90 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
