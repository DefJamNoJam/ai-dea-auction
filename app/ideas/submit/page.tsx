"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider" // useAuth 훅 임포트

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, Shield, AlertCircle, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

const categories = [
  "FinTech", "Healthcare", "Robotics", "Developer Tools",
  "Media & Entertainment", "Education", "E-commerce", "Other",
]

const auctionDurations = ["3", "7", "14", "30"];

const translations = {
  // ... (이전과 동일한 번역 내용)
    en: {
    title: "Submit Your AI Idea",
    subtitle: "Share your innovative AI concept with potential buyers worldwide",
    basicInfo: "Basic Information",
    basicInfoDesc: "Provide the essential details about your AI idea",
    ideaTitle: "Idea Title",
    ideaTitlePlaceholder: "Enter a compelling title for your AI idea",
    description: "Description",
    descriptionPlaceholder: "Describe your AI idea in detail. What problem does it solve? How does it work?",
    category: "Category",
    categoryPlaceholder: "Select a category",
    startingPrice: "Starting Price (USD)",
    auctionDuration: "Auction Duration",
    days: "days",
    tags: "Tags",
    tagsPlaceholder: "Add relevant tags (e.g., Machine Learning, NLP)",
    addTag: "Add",
    technicalDetails: "Technical Details",
    technicalDetailsDesc: "Provide technical information to help buyers understand your idea",
    technicalImpl: "Technical Implementation",
    technicalImplPlaceholder: "Describe the technical approach, algorithms, technologies, and architecture involved",
    marketPotential: "Market Potential",
    marketPotentialPlaceholder: "Explain the market opportunity, target audience, and potential revenue streams",
    competitiveAdvantage: "Competitive Advantage",
    competitiveAdvantagePlaceholder: "What makes your idea unique? How does it differ from existing solutions?",
    implementationPlan: "Implementation Plan",
    implementationPlanPlaceholder:
      "Outline the steps needed to bring this idea to market, including timeline and resources",
    legalProtection: "Legal Protection",
    legalProtectionDesc: "Ensure your intellectual property is protected",
    ipProtection: "Intellectual Property Protection",
    ipProtectionDesc:
      "Your idea will be protected by our comprehensive legal framework. All viewers must sign an NDA before accessing detailed information, and all interactions are logged for legal purposes.",
    ndaAgreement: "I agree to the NDA requirements",
    ndaAgreementDesc: "All potential buyers must sign a Non-Disclosure Agreement before viewing your idea details",
    termsAgreement: "I agree to the Terms of Service",
    termsAgreementDesc: "By submitting, you agree to our platform terms and commission structure",
    cancel: "Cancel",
    submitIdea: "Submit Idea",
    submitting: "Submitting...",
    submitSuccess: "Idea submitted successfully!",
    submitError: "Failed to submit idea. Please try again.",
  },
  ko: {
    title: "AI 아이디어 제출",
    subtitle: "전 세계 잠재 구매자들과 혁신적인 AI 컨셉을 공유하세요",
    basicInfo: "기본 정보",
    basicInfoDesc: "AI 아이디어에 대한 필수 세부사항을 제공하세요",
    ideaTitle: "아이디어 제목",
    ideaTitlePlaceholder: "AI 아이디어에 대한 매력적인 제목을 입력하세요",
    description: "설명",
    descriptionPlaceholder: "AI 아이디어를 자세히 설명하세요. 어떤 문제를 해결하나요? 어떻게 작동하나요?",
    category: "카테고리",
    categoryPlaceholder: "카테고리를 선택하세요",
    startingPrice: "경매 시작가 (USD)",
    auctionDuration: "경매 기간",
    days: "일",
    tags: "태그",
    tagsPlaceholder: "관련 태그를 추가하세요 (예: 머신러닝, NLP)",
    addTag: "추가",
    technicalDetails: "기술적 세부사항",
    technicalDetailsDesc: "구매자가 아이디어를 이해할 수 있도록 기술 정보를 제공하세요",
    technicalImpl: "기술적 구현",
    technicalImplPlaceholder: "기술적 접근법, 알고리즘, 기술 및 아키텍처를 설명하세요",
    marketPotential: "시장 잠재력",
    marketPotentialPlaceholder: "시장 기회, 대상 고객 및 잠재적 수익원을 설명하세요",
    competitiveAdvantage: "경쟁 우위",
    competitiveAdvantagePlaceholder: "아이디어의 독특한 점은 무엇인가요? 기존 솔루션과 어떻게 다른가요?",
    implementationPlan: "구현 계획",
    implementationPlanPlaceholder:
      "타임라인과 리소스를 포함하여 이 아이디어를 시장에 출시하는 데 필요한 단계를 설명하세요",
    legalProtection: "법적 보호",
    legalProtectionDesc: "지적 재산권이 보호되도록 하세요",
    ipProtection: "지적 재산권 보호",
    ipProtectionDesc:
      "귀하의 아이디어는 포괄적인 법적 프레임워크로 보호됩니다. 모든 조회자는 상세 정보에 액세스하기 전에 NDA에 서명해야 하며, 모든 상호작용은 법적 목적으로 기록됩니다.",
    ndaAgreement: "NDA 요구사항에 동의합니다",
    ndaAgreementDesc: "모든 잠재 구매자는 아이디어 세부사항을 보기 전에 비공개 계약서에 서명해야 합니다",
    termsAgreement: "서비스 약관에 동의합니다",
    termsAgreementDesc: "제출함으로써 플랫폼 약관 및 수수료 구조에 동의합니다",
    cancel: "취소",
    submitIdea: "아이디어 제출",
    submitting: "제출 중...",
    submitSuccess: "아이디어가 성공적으로 제출되었습니다!",
    submitError: "아이디어 제출에 실패했습니다. 다시 시도해주세요.",
  },
}

export default function SubmitIdeaPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const { user, token } = useAuth(); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startingPrice: "5000",
    auctionDuration: "7",
    tags: [] as string[],
    technicalDetails: "",
    marketPotential: "",
    competitiveAdvantage: "",
    implementationPlan: "",
  })

  const [currentTag, setCurrentTag] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [agreedToNDA, setAgreedToNDA] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const t = translations[language as keyof typeof translations] || translations.en

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return;
    if (!user) {
        setError("You must be logged in to submit an idea.");
        router.push('/login?returnTo=/ideas/submit');
        return;
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const ideaInput = {
        ...formData,
        status: "Auction",
        authorId: user.id, // 로그인된 사용자의 ID를 사용
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 로그인 시 발급받은 토큰을 헤더에 추가
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ideaInput),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server responded with an error');
      }

      const newIdea = await response.json();

      alert(t.submitSuccess)
      router.push(`/ideas/${newIdea.id}`)

    } catch (err) {
      console.error("Error submitting idea:", err)
      setError((err as Error).message || t.submitError);
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.title &&
    formData.description &&
    formData.category &&
    formData.startingPrice &&
    formData.auctionDuration &&
    agreedToTerms &&
    agreedToNDA &&
    !isSubmitting

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
            <CardHeader>
              <CardTitle>{t.basicInfo}</CardTitle>
              <CardDescription>{t.basicInfoDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div>
                <Label htmlFor="title">{t.ideaTitle} *</Label>
                <Input id="title" placeholder={t.ideaTitlePlaceholder} value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="mt-2" required />
              </div>
              <div>
                <Label htmlFor="description">{t.description} *</Label>
                <Textarea id="description" placeholder={t.descriptionPlaceholder} value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} className="mt-2 min-h-32" required/>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">{t.category} *</Label>
                  <Select required value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="mt-2"><SelectValue placeholder={t.categoryPlaceholder} /></SelectTrigger>
                    <SelectContent>{categories.map((category) => (<SelectItem key={category} value={category}>{category}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div>
                    <Label htmlFor="startingPrice">{t.startingPrice} *</Label>
                    <Input id="startingPrice" type="number" placeholder="5000" value={formData.startingPrice} onChange={(e) => handleInputChange("startingPrice", e.target.value)} className="mt-2" required min="0"/>
                </div>
                <div>
                    <Label htmlFor="auctionDuration">{t.auctionDuration}</Label>
                    <Select value={formData.auctionDuration} onValueChange={(value) => handleInputChange("auctionDuration", value)}>
                        <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                        <SelectContent>{auctionDurations.map(d => <SelectItem key={d} value={d}>{d} {t.days}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="tags">{t.tags}</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder={t.tagsPlaceholder} value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}/>
                    <Button type="button" onClick={addTag} variant="outline">{t.addTag}</Button>
                  </div>
                  {formData.tags.length > 0 && (<div className="flex flex-wrap gap-2">{formData.tags.map((tag, index) => (<Badge key={index} variant="secondary" className="flex items-center gap-1">{tag}<X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} /></Badge>))}</div>)}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t.technicalDetails}</CardTitle>
              <CardDescription>{t.technicalDetailsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="technicalDetails">{t.technicalImpl}</Label>
                <Textarea id="technicalDetails" placeholder={t.technicalImplPlaceholder} value={formData.technicalDetails} onChange={(e) => handleInputChange("technicalDetails", e.target.value)} className="mt-2 min-h-24" />
              </div>
              <div>
                <Label htmlFor="marketPotential">{t.marketPotential}</Label>
                <Textarea id="marketPotential" placeholder={t.marketPotentialPlaceholder} value={formData.marketPotential} onChange={(e) => handleInputChange("marketPotential", e.target.value)} className="mt-2 min-h-24" />
              </div>
              <div>
                <Label htmlFor="competitiveAdvantage">{t.competitiveAdvantage}</Label>
                <Textarea id="competitiveAdvantage" placeholder={t.competitiveAdvantagePlaceholder} value={formData.competitiveAdvantage} onChange={(e) => handleInputChange("competitiveAdvantage", e.target.value)} className="mt-2 min-h-24" />
              </div>
              <div>
                <Label htmlFor="implementationPlan">{t.implementationPlan}</Label>
                <Textarea id="implementationPlan" placeholder={t.implementationPlanPlaceholder} value={formData.implementationPlan} onChange={(e) => handleInputChange("implementationPlan", e.target.value)} className="mt-2 min-h-24" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />{t.legalProtection}</CardTitle>
              <CardDescription>{t.legalProtectionDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{t.ipProtection}</h4>
                    <p className="text-sm text-muted-foreground">{t.ipProtectionDesc}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="nda-agreement" checked={agreedToNDA} onCheckedChange={(checked) => setAgreedToNDA(checked as boolean)} required />
                  <div>
                    <Label htmlFor="nda-agreement" className="text-sm font-medium">{t.ndaAgreement} *</Label>
                    <p className="text-xs text-muted-foreground mt-1">{t.ndaAgreementDesc}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms-agreement" checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} required />
                  <div>
                    <Label htmlFor="terms-agreement" className="text-sm font-medium">{t.termsAgreement} *</Label>
                    <p className="text-xs text-muted-foreground mt-1">{t.termsAgreementDesc}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end items-center space-x-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Link href="/marketplace">
              <Button type="button" variant="outline">{t.cancel}</Button>
            </Link>
            <Button type="submit" disabled={!isFormValid} className="px-8">
              <Upload className="h-4 w-4 mr-2" />
              {isSubmitting ? t.submitting : t.submitIdea}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}