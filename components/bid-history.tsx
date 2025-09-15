"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TrendingUp, Crown, Clock } from "lucide-react"

interface Bid {
  id: string
  bidder: string
  amount: number
  time: string
  isWinning?: boolean
  avatar?: string
}

interface BidHistoryProps {
  bids: Bid[]
  showAll?: boolean
}

export function BidHistory({ bids, showAll = false }: BidHistoryProps) {
  const [expanded, setExpanded] = useState(showAll)

  const displayBids = expanded ? bids : bids.slice(0, 5)
  const hasMore = bids.length > 5

  const formatTimeAgo = (timeString: string) => {
    // Simple time formatting - in a real app you'd use a library like date-fns
    return timeString
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Bid History
        </CardTitle>
        <CardDescription>
          {bids.length} bid{bids.length !== 1 ? "s" : ""} placed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayBids.map((bid, index) => (
            <div
              key={bid.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                bid.isWinning ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={bid.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{bid.bidder[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{bid.bidder}</span>
                    {bid.isWinning && (
                      <Badge variant="default" className="text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        Winning
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(bid.time)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${bid.isWinning ? "text-primary" : "text-foreground"}`}>
                  ${bid.amount.toLocaleString()}
                </div>
                {index === 0 && bids.length > 1 && (
                  <div className="text-xs text-muted-foreground">
                    +${(bid.amount - bids[1].amount).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {hasMore && !expanded && (
          <Button variant="ghost" size="sm" onClick={() => setExpanded(true)} className="w-full mt-3">
            Show {bids.length - 5} more bids
          </Button>
        )}

        {expanded && hasMore && (
          <Button variant="ghost" size="sm" onClick={() => setExpanded(false)} className="w-full mt-3">
            Show less
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
