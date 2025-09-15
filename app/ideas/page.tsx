"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function IdeasPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/marketplace")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to marketplace...</p>
      </div>
    </div>
  )
}
