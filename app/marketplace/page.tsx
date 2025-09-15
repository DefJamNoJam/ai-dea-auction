"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AuctionTimer } from '@/components/auction-timer'; // 경매 타이머 컴포넌트
import { Lightbulb, DollarSign } from 'lucide-react';

// API 응답에 맞는 타입 정의
interface ActiveAuction {
  id: string;
  title: string;
  description: string;
  author: {
    name: string | null;
  };
  auction: {
    currentBid: number | null;
    endTime: string;
  } | null;
  _count: {
    likedBy: number;
    comments: number;
  };
}

export default function MarketplacePage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<ActiveAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveAuctions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auctions/active`);
        if (!response.ok) {
          throw new Error('Failed to fetch active auctions');
        }
        const data = await response.json();
        setAuctions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveAuctions();
  }, []);

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Explore innovative ideas currently up for auction.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">Loading active auctions...</div>
      ) : auctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((idea) => (
            <Card key={idea.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col flex-grow">
                <div className="flex-grow mb-4">
                  <Badge variant="default" className="mb-2">Auction</Badge>
                  <Link href={`/ideas/${idea.id}`}>
                    <h2 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">{idea.title}</h2>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">by {idea.author?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600 mt-3 line-clamp-3">{idea.description}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Current Bid</span>
                    <span className="font-bold text-lg text-primary">
                      ${(idea.auction?.currentBid ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Auction Ends</span>
                    {idea.auction && <AuctionTimer endTime={new Date(idea.auction.endTime)} />}
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => router.push(`/auctions/${idea.id}`)}>
                  Place a Bid
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-gray-50/50">
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No Active Auctions Found</h2>
          <p className="mt-2 text-muted-foreground">There are currently no ideas up for auction. Check back later!</p>
          <Button className="mt-6" onClick={() => router.push('/browse')}>
            Browse All Ideas
          </Button>
        </div>
      )}
    </div>
  );
}