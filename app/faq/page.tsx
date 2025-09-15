"use client";

import { useLanguage } from '@/components/language-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircleQuestion } from 'lucide-react';

export default function FaqPage() {
  const { t } = useLanguage();

  const faqs = [
    { id: "faq-1", q: t('faq.q1'), a: t('faq.a1') },
    { id: "faq-2", q: t('faq.q2'), a: t('faq.a2') },
    { id: "faq-3", q: t('faq.q3'), a: t('faq.a3') },
    { id: "faq-4", q: t('faq.q4'), a: t('faq.a4') },
  ];

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <MessageCircleQuestion className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold">{t('faq.title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('faq.subtitle')}</p>
        </div>

        {/* --- UI Wrapper Card 추가 --- */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-lg text-left">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}