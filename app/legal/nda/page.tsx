// app/legal/nda/page.tsx 파일의 전체 내용을 이 코드로 교체해주세요.

"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, HelpCircle, Shield } from "lucide-react";

// 각 조항을 위한 컴포넌트
const Clause = ({ title, legalText, plainText }: { title: string, legalText: string, plainText: string }) => {
  const { t } = useLanguage();
  return (
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <p className="text-sm text-gray-600 leading-relaxed">{legalText}</p>
        <div className="bg-purple-50 border-l-4 border-purple-300 p-3 rounded-r-lg">
          <p className="font-semibold text-sm text-purple-800">{t('nda.what_this_means')}</p>
          <p className="text-sm text-purple-700 mt-1">{plainText}</p>
        </div>
      </div>
    </div>
  );
};

export default function NdaPage() {
  const { t } = useLanguage();

  const handleDownload = async () => {
    try {
      const response = await fetch('/Standard_NDA_Template.pdf');
      if (!response.ok) {
        throw new Error('File not found');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'AI-dea_Auction_Standard_NDA.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file.');
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* [수정] 제목 부분을 왼쪽 정렬로 변경 */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            {t('nda.title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t('nda.subtitle')}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('nda.why_crucial')}</CardTitle>
            <CardDescription>
              {t('nda.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            <h2 className="text-2xl font-semibold text-gray-800 pt-4">{t('nda.standard_nda')}</h2>
            
            <div className="space-y-8">
              <Clause 
                title={t('nda.clause1_title')}
                legalText={t('nda.clause1_legal')}
                plainText={t('nda.clause1_plain')}
              />
              <Clause 
                title={t('nda.clause2_title')}
                legalText={t('nda.clause2_legal')}
                plainText={t('nda.clause2_plain')}
              />
              <Clause 
                title={t('nda.clause3_title')}
                legalText={t('nda.clause3_legal')}
                plainText={t('nda.clause3_plain')}
              />
            </div>

            <div className="text-center pt-6">
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {t('nda.download_button')}
              </Button>
            </div>
            
            <Separator />

            <div className="pt-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <HelpCircle className="mr-3 h-6 w-6 text-primary" />
                {t('nda.faq_title')}
              </h2>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800">{t('nda.faq1_q')}</h4>
                  <p className="mt-1 text-gray-600 text-sm">{t('nda.faq1_a')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{t('nda.faq2_q')}</h4>
                  <p className="mt-1 text-gray-600 text-sm">{t('nda.faq2_a')}</p>
                </div>
              </div>
            </div>

            <Separator />
            
            <div className="pt-4">
              <h3 className="font-semibold text-gray-800">{t('nda.disclaimer_title')}</h3>
              <p className="mt-2 text-xs text-gray-500">
                {t('nda.disclaimer_text')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}