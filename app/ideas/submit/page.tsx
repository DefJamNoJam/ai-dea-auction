"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { post } from 'aws-amplify/api'; // Amplify API 함수 import

export default function SubmitIdeaPage() {
  const router = useRouter();
  const { user } = useAuth(); // token 제거

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    startingPrice: "",
    auctionDuration: "7",
    technicalDetails: "",
    marketPotential: "",
    competitiveAdvantage: "",
    implementationPlan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const ideaData = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        startingPrice: parseFloat(formData.startingPrice) || 0,
        auctionDuration: parseInt(formData.auctionDuration) || 7,
      };

      // fetch와 token 대신 Amplify post 사용
      const restOperation = post({
        apiName: "apigw",
        path: "/ideas",
        options: {
          body: ideaData
        }
      });
      
      const response = await restOperation.response;
      const data: any = await response.body.json();

      if (response.statusCode !== 201) {
        if (data && typeof data === 'object' && 'error' in data) {
            throw new Error(data.error || "Failed to submit idea.");
        }
        throw new Error("Failed to submit idea due to an unknown error.");
      }
      
      // 성공 시 상세 페이지로 이동
      router.push(`/ideas/${data.id}`);

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
        <div className="text-center p-20">
            <p>You must be logged in to submit an idea.</p>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Submit Your AI Idea</CardTitle>
          <CardDescription>Fill out the form below to list your idea for auction.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields... (rest of the component is the same) */}
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={5} />
            </div>
            {/* ... other fields like category, tags, etc. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" name="category" value={formData.category} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startingPrice">Starting Price ($)</Label>
                    <Input id="startingPrice" name="startingPrice" type="number" value={formData.startingPrice} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="auctionDuration">Auction Duration (days)</Label>
                    <Input id="auctionDuration" name="auctionDuration" type="number" value={formData.auctionDuration} onChange={handleChange} required />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="technicalDetails">Technical Details</Label>
                <Textarea id="technicalDetails" name="technicalDetails" value={formData.technicalDetails} onChange={handleChange} rows={5} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="marketPotential">Market Potential</Label>
                <Textarea id="marketPotential" name="marketPotential" value={formData.marketPotential} onChange={handleChange} rows={5} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
                <Textarea id="competitiveAdvantage" name="competitiveAdvantage" value={formData.competitiveAdvantage} onChange={handleChange} rows={5} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="implementationPlan">Implementation Plan</Label>
                <Textarea id="implementationPlan" name="implementationPlan" value={formData.implementationPlan} onChange={handleChange} rows={5} />
            </div>
            
            {error && <p className="text-red-500">{error}</p>}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Idea"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}