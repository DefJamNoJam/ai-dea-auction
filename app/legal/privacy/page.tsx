// app/legal/privacy/page.tsx 파일의 전체 내용을 이 코드로 교체해주세요.

"use client";

import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            {t("privacy.title")}
          </h1>
          <p className="text-muted-foreground">{t("privacy.lastUpdated")}: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("privacy.mainTitle")}</CardTitle>
            <CardDescription>{t("privacy.mainDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] w-full">
              <div className="space-y-6 pr-4">
                <section>
                  <h3 className="text-lg font-semibold mb-3">{t("privacy.infoWeCollect_title")}</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t("privacy.infoWeCollect_p1_title")}</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{t("privacy.infoWeCollect_p1_l1")}</li>
                        <li>{t("privacy.infoWeCollect_p1_l2")}</li>
                        <li>{t("privacy.infoWeCollect_p1_l3")}</li>
                        <li>{t("privacy.infoWeCollect_p1_l4")}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t("privacy.infoWeCollect_p2_title")}</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{t("privacy.infoWeCollect_p2_l1")}</li>
                        <li>{t("privacy.infoWeCollect_p2_l2")}</li>
                        <li>{t("privacy.infoWeCollect_p2_l3")}</li>
                        <li>{t("privacy.infoWeCollect_p2_l4")}</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t("privacy.infoWeCollect_p3_title")}</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{t("privacy.infoWeCollect_p3_l1")}</li>
                        <li>{t("privacy.infoWeCollect_p3_l2")}</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* 여기에 다른 개인정보처리방침 섹션들을 추가할 수 있습니다. */}
                
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}