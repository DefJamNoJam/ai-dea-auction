"use client";

import { useLanguage } from '@/components/language-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LifeBuoy, BookOpen, User, Shield, Search } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const { t } = useLanguage();

  const topics = [
    { title: t('help.gettingStarted'), icon: BookOpen, href: '#' },
    { title: t('help.forSellers'), icon: User, href: '#' },
    { title: t('help.forBidders'), icon: User, href: '#' },
    { title: t('help.accountSecurity'), icon: Shield, href: '#' },
  ];

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <LifeBuoy className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold">{t('help.title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('help.subtitle')}</p>
        </div>
        
        {/* --- UI Wrapper Card 추가 --- */}
        <Card className="p-6 sm:p-8">
          <CardContent className="p-0">
            <div className="relative mb-8">
              <Input placeholder={t('help.searchPlaceholder')} className="pl-10 h-12 text-base" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic, index) => (
                <Link href={topic.href} key={index} className="block">
                  <div className="p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all h-full">
                    <div className="flex items-center gap-4">
                      <topic.icon className="h-8 w-8 text-primary flex-shrink-0" />
                      <p className="font-semibold">{topic.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}