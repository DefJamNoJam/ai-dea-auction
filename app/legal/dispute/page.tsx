// app/legal/dispute/page.tsx 파일의 전체 내용을 이 코드로 교체해주세요.

"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Send, Upload, X } from "lucide-react";

export default function DisputePage() {
  const { t } = useLanguage();

  // [추가] 파일 업로드를 위한 상태 추가
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    disputeType: "",
    ideaId: "",
    description: "",
    contactEmail: "",
    urgency: "medium",
    agreedToProcess: false,
  });
  
  // [추가] 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData, evidenceFile: evidenceFile?.name };
    console.log("Dispute submitted:", submissionData);
    alert("Dispute submitted successfully! Our legal team will review and contact you within 24 hours.");
  };

  const isFormValid = formData.disputeType && formData.description && formData.contactEmail && formData.agreedToProcess;

  // [추가] 다국어를 위한 옵션 키 배열
  const disputeTypeKeys = ["ip_violation", "nda_breach", "payment", "manipulation", "fraud", "policy_violation", "other"];
  const urgencyLevelKeys = ["low", "medium", "high"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-primary" />
                {t("dispute.title")}
            </h1>
            <p className="mt-2 text-lg text-gray-600">{t("dispute.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("dispute.form_title")}</CardTitle>
                <CardDescription>{t("dispute.form_subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dispute-type">{t("dispute.type")} *</Label>
                      {/* [수정] 다국어 옵션을 렌더링하도록 변경 */}
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, disputeType: value}))}>
                        <SelectTrigger id="dispute-type" className="mt-1"><SelectValue placeholder={t("dispute.type_placeholder")} /></SelectTrigger>
                        <SelectContent>{disputeTypeKeys.map(key => <SelectItem key={key} value={key}>{t(`dispute.types.${key}`)}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="urgency-level">{t("dispute.urgency")}</Label>
                      {/* [수정] 다국어 옵션을 렌더링하도록 변경 */}
                      <Select defaultValue="medium" onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}>
                        <SelectTrigger id="urgency-level" className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>{urgencyLevelKeys.map(key => <SelectItem key={key} value={key}>{t(`dispute.urgency_levels.${key}`)}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="idea-id">{t("dispute.ideaId")}</Label>
                    <Input id="idea-id" placeholder={t("dispute.ideaId_placeholder")} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">{t("dispute.contactEmail")} *</Label>
                    <Input id="contact-email" type="email" placeholder={t("dispute.contactEmail_placeholder")} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="description">{t("dispute.description")} *</Label>
                    <Textarea id="description" placeholder={t("dispute.description_placeholder")} required className="mt-1 min-h-28" />
                  </div>
                  <div>
                    <Label htmlFor="evidence-file">{t("dispute.evidence")}</Label>
                    {/* [수정] Textarea를 파일 업로드 UI로 변경 */}
                    <div className="mt-1 flex items-center justify-center w-full">
                        <label htmlFor="evidence-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF (MAX. 10MB)</p>
                            </div>
                            <Input id="evidence-file" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    {evidenceFile && (
                        <div className="mt-2 flex items-center justify-between p-2 bg-gray-100 rounded-md text-sm">
                            <span>{evidenceFile.name}</span>
                            <Button variant="ghost" size="sm" onClick={() => setEvidenceFile(null)}><X className="h-4 w-4" /></Button>
                        </div>
                    )}
                  </div>
                  <div className="flex items-start space-x-3">
                    {/* [수정] 체크박스 스타일 변경 */}
                    <Checkbox id="agreement" required onCheckedChange={(checked) => setFormData(prev => ({...prev, agreedToProcess: checked as boolean}))} className="border-gray-400" />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="agreement" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t("dispute.agreement")} *</label>
                      <p className="text-sm text-muted-foreground">{t("dispute.agreement_desc")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button type="submit" disabled={!isFormValid}>
                      <Send className="mr-2 h-4 w-4" />
                      {t("dispute.submit")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>{t("dispute.sidebar_legal_title")}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <div><strong>24/7</strong><p>{t("dispute.sidebar_legal_p1")}</p></div>
                <div><strong>100%</strong><p>{t("dispute.sidebar_legal_p2")}</p></div>
                <div><strong>5 Years</strong><p>{t("dispute.sidebar_legal_p3")}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{t("dispute.sidebar_process_title")}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3"><div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div><div><div className="font-medium text-sm">{t("dispute.sidebar_process_s1")}</div><div className="text-xs text-muted-foreground">24-48 hours</div></div></div>
                  <div className="flex items-start gap-3"><div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div><div><div className="font-medium text-sm">{t("dispute.sidebar_process_s2")}</div><div className="text-xs text-muted-foreground">3-7 days</div></div></div>
                  <div className="flex items-start gap-3"><div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div><div><div className="font-medium text-sm">{t("dispute.sidebar_process_s3")}</div><div className="text-xs text-muted-foreground">1-2 weeks</div></div></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>{t("dispute.sidebar_contact_title")}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{t("dispute.sidebar_contact_desc")}</p>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Email:</span> legal@ai-dea-auction.com</div>
                  <div><span className="font-medium">Phone:</span> +1 (555) 123-LEGAL</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}