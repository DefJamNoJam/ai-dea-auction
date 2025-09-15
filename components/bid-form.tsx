"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Zap } from "lucide-react"

interface BidFormProps {
  currentBid: number
  minimumBid: number
  onBid: (amount: number) => void
  isLoading?: boolean
  hasSignedNDA: boolean
}

export function BidForm({ currentBid, minimumBid, onBid, isLoading = false, hasSignedNDA }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState("")
  const [selectedQuickBid, setSelectedQuickBid] = useState<number | null>(null)

  const quickBidAmounts = [minimumBid, minimumBid + 500, minimumBid + 1000, minimumBid + 2500]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = selectedQuickBid || Number.parseInt(bidAmount)
    if (amount >= minimumBid) {
      onBid(amount)
      setBidAmount("")
      setSelectedQuickBid(null)
    }
  }

  const handleQuickBid = (amount: number) => {
    setSelectedQuickBid(amount)
    setBidAmount("")
  }

  if (!hasSignedNDA) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Sign NDA to Bid</CardTitle>
          <CardDescription>
            You must sign the Non-Disclosure Agreement before placing bids on this idea.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const finalAmount = selectedQuickBid || Number.parseInt(bidAmount) || 0
  const isValidBid = finalAmount >= minimumBid

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Place Your Bid
        </CardTitle>
        <CardDescription>
          Current highest bid: <span className="font-semibold text-primary">${currentBid.toLocaleString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Bid Options */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Quick Bid Options</Label>
          <div className="grid grid-cols-2 gap-2">
            {quickBidAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedQuickBid === amount ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickBid(amount)}
                className="text-xs"
              >
                ${amount.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Bid */}
        <div>
          <Label htmlFor="custom-bid" className="text-sm font-medium">
            Or Enter Custom Amount
          </Label>
          <Input
            id="custom-bid"
            type="number"
            placeholder={`Minimum: $${minimumBid.toLocaleString()}`}
            value={bidAmount}
            onChange={(e) => {
              setBidAmount(e.target.value)
              setSelectedQuickBid(null)
            }}
            className="mt-1"
          />
        </div>

        {/* Bid Summary */}
        {finalAmount > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Your bid:</span>
              <span className="font-semibold text-lg">${finalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Increase:</span>
              <Badge variant={isValidBid ? "default" : "destructive"} className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +${(finalAmount - currentBid).toLocaleString()}
              </Badge>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={handleSubmit} disabled={!isValidBid || isLoading} className="w-full" size="lg">
          {isLoading ? (
            "Placing Bid..."
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Place Bid ${finalAmount.toLocaleString()}
            </>
          )}
        </Button>

        {!isValidBid && finalAmount > 0 && (
          <p className="text-sm text-destructive">Bid must be at least ${minimumBid.toLocaleString()}</p>
        )}
      </CardContent>
    </Card>
  )
}
