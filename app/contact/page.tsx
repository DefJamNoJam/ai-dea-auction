"use client";

import { useLanguage } from '@/components/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Info } from 'lucide-react';

export default function ContactPage() {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! (This is a local placeholder)");
  };

  return (
    <div className="bg-gray-50/50">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold">{t('contact.title')}</h1>
          <p className="text-lg text-muted-foreground mt-2">{t('contact.subtitle')}</p>
        </div>
        
        {/* --- UI Wrapper Card로 통합 --- */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold">Send Message</h2>
                <div>
                  <Label htmlFor="name">{t('contact.form.name')}</Label>
                  <Input id="name" type="text" required />
                </div>
                <div>
                  <Label htmlFor="email">{t('contact.form.email')}</Label>
                  <Input id="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="subject">{t('contact.form.subject')}</Label>
                  <Input id="subject" type="text" required />
                </div>
                <div>
                  <Label htmlFor="message">{t('contact.form.message')}</Label>
                  <Textarea id="message" required rows={5} />
                </div>
                <Button type="submit" className="w-full">{t('contact.form.submit')}</Button>
              </form>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  {t('contact.info.title')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a href={`mailto:${t('contact.info.email')}`} className="text-primary hover:underline break-all">
                      {t('contact.info.email')}
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold">Response Time</h3>
                    <p className="text-muted-foreground">{t('contact.info.response')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}