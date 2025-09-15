// app/browse/page.tsx (전체 코드)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
interface Idea {
  id: string;
  title: string;
  description: string;
  category: string | null;
  tags: string[];
  status: string;
  views: number | null;
  likes: number | null;
  _count: {
    comments: number;
  };
}
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Eye, Lightbulb, Heart } from "lucide-react";

export default function BrowsePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas`);
        if (!response.ok) {
          throw new Error('Failed to fetch ideas');
        }
        const fetchedIdeas = await response.json();
        setIdeas(fetchedIdeas);
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError("아이디어를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
     return <div className="text-center p-20 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{t("browse.title")}</h1>
        <p className="text-lg text-gray-600 mt-2">{t("browse.subtitle")}</p>
      </header>
      
      {ideas.length === 0 ? (
          <div className="text-center py-16">
            <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Ideas Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">It looks like there are no ideas here yet. Why not be the first?</p>
            <Link href="/ideas/submit">
              <Button size="lg">{t("marketplace.submitIdea")}</Button>
            </Link>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="flex flex-col transition-shadow duration-300 group hover:shadow-xl cursor-pointer"
            >
              <div className="flex-grow" onClick={() => router.push(`/ideas/${idea.id}`)}>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">{idea.category || 'Uncategorized'}</Badge>
                    <Badge variant={idea.status === 'Auction' ? 'default' : 'secondary'}>
                      {idea.status}
                    </Badge>
                  </div>
                  <CardTitle className="h-16 group-hover:text-primary transition-colors">{idea.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="h-24 overflow-hidden text-ellipsis">
                    {idea.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {idea.tags?.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="font-normal">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
              <div className="p-6 pt-0 mt-auto">
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-1"> <Eye size={16} /> {idea.views || 0} </div>
                  <div className="flex items-center gap-1"> <Heart size={16} /> {idea.likes || 0} </div>
                  <div className="flex items-center gap-1"> <MessageSquare size={16} /> {idea._count.comments || 0} </div>
                </div>
                <div className="mt-4">
                  {/* --- ✨ 수정된 부분: status가 Auction이면 /auctions/:id 로 연결 --- */}
                  <Button className="w-full" asChild>
                    <Link href={idea.status === 'Auction' ? `/auctions/${idea.id}` : `/ideas/${idea.id}`}>
                      {idea.status === 'Auction' ? t("browse.joinAuction") : t("browse.viewDetails")}
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}