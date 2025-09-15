"use client"

import { useEffect } from "react"

interface ActivityLoggerProps {
  userId?: string
  ideaId?: string
  action: string
  details?: Record<string, any>
}

export function ActivityLogger({ userId, ideaId, action, details }: ActivityLoggerProps) {
  useEffect(() => {
    const logActivity = async () => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        userId: userId || "anonymous",
        ideaId,
        action,
        details,
        userAgent: navigator.userAgent,
        ip: "hidden", // In a real app, this would be handled server-side
        sessionId: sessionStorage.getItem("sessionId") || "unknown",
      }

      // In a real application, this would send to your backend
      console.log("Activity Log:", logEntry)

      // Store in localStorage for demo purposes
      const existingLogs = JSON.parse(localStorage.getItem("activityLogs") || "[]")
      existingLogs.push(logEntry)
      localStorage.setItem("activityLogs", JSON.stringify(existingLogs.slice(-100))) // Keep last 100 logs
    }

    logActivity()
  }, [userId, ideaId, action, details])

  return null // This component doesn't render anything
}
