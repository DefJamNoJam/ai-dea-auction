"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuctionTimer } from "@/components/auction-timer"
import { Lightbulb, Search, Filter, TrendingUp, Eye, Users, Gavel } from "lucide-react"
import Link from "next/link"

// Mock data for active auctions
const mockAuctions = [
  {
    id: 1,
    title: "AI-Powered Personal Finance Assistant",
    description: "Intelligent system for personalized financial advice using ML algorithms.",
    category: "FinTech",
    currentBid: 7500,
    startingPrice: 5000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    bidCount: 7,
    views: 234,
    status: "hot",
    creator: "TechInnovator",
  },
  {
    id: 2,
    title: "Smart Healthcare Diagnosis System",
    description: "Revolutionary AI for early disease detection using computer vision.",
    category: "Healthcare",
    currentBid: 22000,
    startingPrice: 15000,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
    bidCount: 12,
    views: 567,
    status: "ending-soon",
    creator: "MedTechPro",
  },
  {
    id: 3,
    title: "Autonomous Drone Navigation AI",
    description: "Advanced navigation system using reinforcement learning.",
    category: "Robotics",
    currentBid: 12500,
    startingPrice: 8000,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    bidCount: 5,
    views: 345,
    status: "active",
    creator: "DroneExpert",
  },
  {
    id: 4,
    title: "Natural Language Code Generator",
    description: "AI system converting natural language to functional code.",
    category: "Developer Tools",
    currentBid: 18000,
    startingPrice: 10000,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    bidCount: 9,
    views: 789,
    status: "popular",
    creator: "CodeWizard",
  },
  {
    id: 5,
    title: "AI-Enhanced Video Editing Suite",
    description: "Intelligent video editing platform for professional-quality videos.",
    category: "Media & Entertainment",
    currentBid: 6000,
    startingPrice: 6000,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    bidCount: 1,
    views: 123,
    status: "new",
    creator: "VideoAI",
  },
]

const categories = ["All", "FinTech", "Healthcare", "Robotics", "Developer Tools", "Media & Entertainment"]
const sortOptions = [
  { value: "ending-soon", label: "Ending Soon" },
  { value: "highest-bid", label: "Highest Bid" },
  { value: "most-popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "lowest-bid", label: "Lowest Bid" },
]

export default function AuctionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("ending-soon")

  const filteredAuctions = mockAuctions.filter((auction) => {
    const matchesSearch =
      auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || auction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    switch (sortBy) {
      case "ending-soon":
        return a.endTime.getTime() - b.endTime.getTime()
      case "highest-bid":
        return b.currentBid - a.currentBid
      case "lowest-bid":
        return a.currentBid - b.currentBid
      case "most-popular":
        return b.views - a.views
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hot":
        return (
          <Badge variant="destructive" className="animate-pulse">
            🔥 Hot
          </Badge>
        )
      case "ending-soon":
        return <Badge variant="destructive">⏰ Ending Soon</Badge>
      case "popular":
        return <Badge variant="secondary">⭐ Popular</Badge>
      case "new":
        return (
          <Badge variant="outline" className="border-primary text-primary">
            ✨ New
          </Badge>
        )
      default:
        return <Badge variant="outline">Active</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Lightbulb className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">AI-dea Auction</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/ideas">
                <Button variant="ghost">Browse Ideas</Button>
              </Link>
              <Link href="/ideas/submit">
                <Button>Submit Idea</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Gavel className="h-8 w-8 text-primary" />
            Live Auctions
          </h1>
          <p className="text-muted-foreground">Bid on innovative AI concepts in real-time</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search active auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{sortedAuctions.length}</div>
              <div className="text-sm text-muted-foreground">Active Auctions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {sortedAuctions.filter((a) => a.endTime.getTime() - Date.now() < 24 * 60 * 60 * 1000).length}
              </div>
              <div className="text-sm text-muted-foreground">Ending Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                ${Math.max(...sortedAuctions.map((a) => a.currentBid)).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Highest Bid</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">
                {sortedAuctions.reduce((sum, a) => sum + a.bidCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Bids</div>
            </CardContent>
          </Card>
        </div>

        {/* Auctions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAuctions.map((auction) => (
            <Card key={auction.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{auction.category}</Badge>
                  {getStatusBadge(auction.status)}
                </div>
                <CardTitle className="text-lg leading-tight">{auction.title}</CardTitle>
                <CardDescription className="line-clamp-2">{auction.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Bid */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Bid</span>
                  <span className="font-bold text-lg text-primary">${auction.currentBid.toLocaleString()}</span>
                </div>

                {/* Bid Increase */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Starting Price</span>
                  <div className="text-right">
                    <span className="text-sm">${auction.startingPrice.toLocaleString()}</span>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <TrendingUp className="h-3 w-3" />+
                      {Math.round(((auction.currentBid - auction.startingPrice) / auction.startingPrice) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Timer */}
                <div className="py-2">
                  <AuctionTimer endTime={auction.endTime} />
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{auction.bidCount} bids</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{auction.views} views</span>
                  </div>
                </div>

                {/* Creator */}
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    by <span className="font-medium text-foreground">{auction.creator}</span>
                  </p>
                </div>

                {/* Action Button */}
                <Link href={`/ideas/${auction.id}`}>
                  <Button className="w-full">
                    <Gavel className="h-4 w-4 mr-2" />
                    View & Bid
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedAuctions.length === 0 && (
          <div className="text-center py-12">
            <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No auctions found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
