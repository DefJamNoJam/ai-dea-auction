// app/mypage/security/page.tsx 파일의 전체 내용을 이 코드로 교체해주세요.

"use client";

import { useState } from "react";
import { updatePassword } from "aws-amplify/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "New passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword({ oldPassword, newPassword });
      setMessage({ type: 'success', text: "Password updated successfully!" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({ type: 'error', text: (error as Error).message || "Failed to update password." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Security</h1>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Choose a strong password and don't reuse it for other accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              
              {message && (
                <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {message.text}
                </p>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save New Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}