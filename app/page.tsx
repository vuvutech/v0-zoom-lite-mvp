import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from 'next/navigation';

export default async function Home() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-3xl text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span className="text-sm font-medium text-accent">Connect, Collaborate, Create</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              Modern Video
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Conferencing</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fast, lightweight, and intuitive. Host or join meetings instantly with real-time chat and crystal-clear video.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full sm:w-auto rounded-lg font-semibold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/signin" className="flex-1 sm:flex-none">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 pt-8 border-t border-border">
            <div className="group p-6 rounded-xl bg-card/50 hover:bg-card border border-border hover:border-accent/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">Optimized for speed with minimal latency and maximum uptime</p>
            </div>

            <div className="group p-6 rounded-xl bg-card/50 hover:bg-card border border-border hover:border-accent/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Real-time Chat</h3>
              <p className="text-sm text-muted-foreground">Instant messaging powered by Socket.io during meetings</p>
            </div>

            <div className="group p-6 rounded-xl bg-card/50 hover:bg-card border border-border hover:border-accent/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Easy Setup</h3>
              <p className="text-sm text-muted-foreground">Create and join meetings in seconds with no configuration</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
