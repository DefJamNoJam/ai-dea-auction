// app/legal/terms/page.tsx 파일의 전체 내용을 이 코드로 교체해주세요.

"use client";

import { useLanguage } from "@/components/language-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";

export default function TermsOfServicePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            {t("terms.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("terms.lastUpdated")}: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("terms.mainTitle")}</CardTitle>
            <CardDescription>{t("terms.mainDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 w-full">
              <div className="space-y-6 pr-4">
                <section>
                  <h3 className="text-lg font-semibold mb-3">{t("terms.acceptance_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("terms.acceptance_p1")}</p>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-semibold mb-3">{t("terms.platformDesc_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("terms.platformDesc_p1")}</p>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-semibold mb-3">{t("terms.userResp_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("terms.userResp_p1")}</p>
                </section>

                <Separator />

                <section>
                  <h3 className="text-lg font-semibold mb-3">{t("terms.ipProtection_title")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("terms.ipProtection_p1")}</p>
                </section>

                {/* Add more sections here as needed */}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}