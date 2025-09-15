// app/mypage/settings/page.tsx 파일의 전체 내용을 이 코드로 교체해주세요.

"use client";

import { useState, useEffect } from "react";
import { fetchUserAttributes, updateUserAttributes, deleteUser } from "aws-amplify/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

interface UserAttributes {
  name?: string;
  email?: string;
}

export default function AccountSettingsPage() {
  const router = useRouter();
  const [attributes, setAttributes] = useState<UserAttributes>({});
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        setAttributes(userAttributes);
        setNewName(userAttributes.name || "");
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttributes();
  }, []);

  const handleUpdateName = async () => {
    setIsLoading(true);
    try {
      await updateUserAttributes({
        userAttributes: {
          name: newName,
        },
      });
      alert("Name updated successfully!");
      // 페이지를 새로고침하여 헤더 등 다른 부분에도 반영
      window.location.reload();
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    const confirmation = prompt("Are you absolutely sure you want to delete your account? This action cannot be undone. Type 'DELETE' to confirm.");
    if (confirmation === 'DELETE') {
      try {
        await deleteUser();
        alert("Account deleted successfully.");
        router.push('/');
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={attributes.email || ""} disabled />
              <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
            </div>
            <Button onClick={handleUpdateName} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive">
           <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Be careful, these actions are permanent.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
                <h3 className="font-semibold">Delete Account</h3>
                <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>Delete My Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}