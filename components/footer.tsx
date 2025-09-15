"use client"

import Link from "next/link"
import { useLanguage } from "./language-provider"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center justify-items-center">
          <div className="space-y-3 w-full max-w-xs">
            <h4 className="font-semibold text-sm">Platform</h4>
            <div className="space-y-2">
              <Link href="/browse" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                {t("nav.browse")}
              </Link>
              <Link
                href="/marketplace"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.marketplace")}
              </Link>
              <Link
                href="/ideas/submit"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("nav.sell")}
              </Link>
              <Link
                href="/auctions"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.auctions")}
              </Link>
            </div>
          </div>

          <div className="space-y-3 w-full max-w-xs">
            <h4 className="font-semibold text-sm">Legal</h4>
            <div className="space-y-2">
              <Link
                href="/legal/terms"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.terms")}
              </Link>
              <Link
                href="/legal/privacy"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.privacy")}
              </Link>
              <Link
                href="/legal/dispute"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.dispute")}
              </Link>
              <Link
                href="/legal/nda"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.nda")}
              </Link>
            </div>
          </div>

          <div className="space-y-3 w-full max-w-xs">
            <h4 className="font-semibold text-sm">Support</h4>
            <div className="space-y-2">
              <Link href="/help" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                {t("footer.help")}
              </Link>
              <Link href="/faq" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
                {t("footer.faq")}
              </Link>
              <Link
                href="/contact"
                className="block text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.contact")}
              </Link>
              {/* --- Community 링크 삭제 --- */}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2024 AI-dea Auction. {t("footer.rights")}
        </div>
      </div>
    </footer>
  )
}