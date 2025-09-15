"use client"

import { useState, useEffect } from "react"
import { Clock, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AuctionTimerProps {
  endTime: Date
  onExpired?: () => void
}

export function AuctionTimer({ endTime, onExpired }: AuctionTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
    total: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = endTime.getTime()
      const difference = end - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds, total: difference })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 })
        onExpired?.()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [endTime, onExpired])

  const isUrgent = timeLeft.total < 24 * 60 * 60 * 1000 // Less than 24 hours
  const isCritical = timeLeft.total < 60 * 60 * 1000 // Less than 1 hour

  if (timeLeft.total <= 0) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Auction Ended
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Clock
        className={`h-4 w-4 ${isCritical ? "text-destructive" : isUrgent ? "text-orange-500" : "text-muted-foreground"}`}
      />
      <div
        className={`font-mono text-sm ${isCritical ? "text-destructive font-bold" : isUrgent ? "text-orange-500 font-semibold" : "text-foreground"}`}
      >
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </div>
      {isCritical && (
        <Badge variant="destructive" className="animate-pulse">
          Ending Soon!
        </Badge>
      )}
    </div>
  )
}
