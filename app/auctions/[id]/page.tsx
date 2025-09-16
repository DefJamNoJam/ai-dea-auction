"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { post } from 'aws-amplify/api'; // ✨ Amplify API post 함수 import

// 데이터 타입 정의
interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  bidder: { name: string | null };
}
interface AuctionData {
  id: string;
  startTime: string;
  endTime: string;
  currentBid: number | null;
  idea: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string | null;
    startingPrice: number | null;
    likes: number | null;
    views: number | null;
    author: { name: string | null; id: string; };
  };
  bids: Bid[];
}

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  // ✨ getAuthHeader 제거
  const { user } = useAuth();
  const ideaId = params.id as string;

  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isBidding, setIsBidding] = useState(false);
  
  const minimumBid = useMemo(() => {
    if (!auction) return 1;
    return (auction.currentBid || auction.idea.startingPrice || 0) + 1;
  }, [auction]);


  useEffect(() => {
    if (!ideaId) return;

    const fetchAuction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auctions/${ideaId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch auction data. The idea may not be up for auction.");
        }
        const data = await res.json();
        setAuction(data);
        const minBid = (data.currentBid || data.idea.startingPrice || 0) + 1;
        setBidAmount(minBid.toString());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuction();
  }, [ideaId]);

  // ✨ --- handlePlaceBid 함수 전체를 Amplify API를 사용하도록 수정 --- ✨
  const handlePlaceBid = async () => {
    if (!user) {
      router.push(`/login?returnTo=/auctions/${ideaId}`);
      return;
    }
    if (parseFloat(bidAmount) < minimumBid) {
      setError(`Your bid must be at least $${minimumBid.toLocaleString()}`);
      return;
    }
    setIsBidding(true);
    setError(null);
    try {
      const restOperation = post({
        apiName: "apigw", // API Gateway 이름을 입력해야 합니다. (아래 설명 참조)
        path: `/auctions/${ideaId}/bids`,
        options: {
          body: {
            amount: parseFloat(bidAmount)
          }
        }
      });
      
      const response = await restOperation.response;
      const data = await response.body.json();

      if (response.statusCode !== 201) {
          throw new Error(data.error || "Failed to place bid.");
      }

      // 성공 시 경매 데이터 새로고침
      setAuction(prev => {
        if (!prev) return null;
        const newBids = [data.newBid, ...prev.bids];
        return { ...prev, currentBid: data.updatedAuction.currentBid, bids: newBids };
      });
      const newMinBid = (data.updatedAuction.currentBid || 0) + 1;
      setBidAmount(newMinBid.toString());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsBidding(false);
    }
  };
  
  if (isLoading) return <div className="text-center p-20">Loading auction...</div>;
  if (error && !auction) return <div className="text-center p-20 text-red-600">{error}</div>;
  if (!auction) return <div className="text-center p-20">Auction not found.</div>;

  const isOwner = user?.id === auction.idea.author.id;

  return (
    <div className="container mx-auto p-8">
      <Card className="border border-gray-200">
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            {auction.idea.category && <Badge variant="outline">{auction.idea.category}</Badge>}
            <Badge>{auction.idea.status}</Badge>
          </div>
          <CardTitle className="mt-3 text-3xl font-bold leading-tight">{auction.idea.title}</CardTitle>
           <CardDescription>
             by {auction.idea.author.name || 'Anonymous'}
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Auction</div>
              <div className="text-2xl font-semibold">
                Current Bid: ${(auction.currentBid || auction.idea.startingPrice || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                Starting Price: ${(auction.idea.startingPrice || 0).toLocaleString()}
              </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Auction Ends In:</p>
                <p className="text-lg font-semibold">{new Date(auction.endTime).toLocaleString()}</p>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {isOwner ? (
                <Card className="border-muted">
                  <CardHeader>
                    <CardTitle className="text-muted-foreground">Owner - Bidding Not Allowed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">You cannot bid on your own idea.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                    <CardHeader><CardTitle>Place Your Bid</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bidAmount">Your Bid Amount</Label>
                            <Input 
                                id="bidAmount"
                                type="number"
                                value={bidAmount}
                                onChange={e => setBidAmount(e.target.value)}
                                placeholder={`$${minimumBid.toLocaleString()} or more`}
                                min={minimumBid}
                            />
                            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            <Button className="w-full" onClick={handlePlaceBid} disabled={isBidding}>
                                {isBidding ? "Placing Bid..." : "Place Bid"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-3 text-sm text-gray-700">
              <h3 className="font-semibold text-lg">Auction Info</h3>
              <div><span className="font-medium">Start Time:</span> {new Date(auction.startTime).toLocaleString()}</div>
              <div><span className="font-medium">End Time:</span> {new Date(auction.endTime).toLocaleString()}</div>
              <div><span className="font-medium">Likes:</span> {auction.idea.likes ?? 0}</div>
              <div><span className="font-medium">Views:</span> {auction.idea.views ?? 0}</div>
              <Button variant="secondary" onClick={() => router.push(`/ideas/${ideaId}`)}>
                View Full Idea Details
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
       <Card className="mt-8">
            <CardHeader><CardTitle>Bid History</CardTitle></CardHeader>
            <CardContent>
              {auction.bids.length > 0 ? (
                <ul className="space-y-2">
                  {auction.bids.map(bid => (
                    <li key={bid.id} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                      <span>{bid.bidder?.name || 'Anonymous'}</span>
                      <div className="text-right">
                        <span className="font-semibold">${bid.amount.toLocaleString()}</span>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true, locale: ko })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p>No bids yet. Be the first!</p>}
            </CardContent>
          </Card>
    </div>
  );
}