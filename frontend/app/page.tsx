import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Welcome</h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Your Next.js app is ready. Navigate to different routes to get started.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/courses">
            <Button>Go to Courses</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
