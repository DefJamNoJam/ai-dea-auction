"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Globe, TrendingUp, Gavel } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import Link from "next/link"

// --- 수정된 부분 1: content 객체를 컴포넌트 바깥으로 이동 ---
// 이렇게 하면 content 객체는 딱 한 번만 생성되어 무한 루프를 방지합니다.
const content = {
  en: {
    hero: {
      title: "Turn Your AI Vision into Value",
      subtitle: "The world's first marketplace to securely auction your AI concepts",
      description:
        "Connect with innovators ready to build the future. Your ideas deserve protection, recognition, and fair compensation.",
      cta1: "Start Your Auction",
      cta2: "Browse Marketplace",
    },
    features: {
      title: "Why Choose AI-dea Auction?",
      items: [
        {
          icon: Shield,
          title: "Your Idea, Legally Protected",
          description:
            "We transform abstract ideas into tradeable intellectual property through our 3-step protection system:\n\n(1) Structured Documentation:\nConvert your idea into a concrete 'proposal' using our templates, establishing the foundation for legal protection.\n\n(2) Timestamped Records:\nAll submissions and viewing records are automatically stored on our servers, providing clear evidence in case of disputes.\n\n(3) Electronic NDA:\nAll viewers must agree to legally binding non-disclosure agreements before accessing detailed content.",
        },
        {
          icon: Globe,
          title: "Global Marketplace",
          description:
            "Connect with innovators and entrepreneurs worldwide in our multilingual platform.\n\nReach international buyers and sellers across different time zones with 24/7 marketplace access. Our platform supports multiple currencies and payment methods, making global transactions seamless and secure.\n\nBenefit from diverse perspectives and market insights from our global community of AI innovators, increasing your idea's potential value and market reach.",
        },
        {
          icon: TrendingUp,
          title: "Fair Pricing",
          description:
            "Transparent auction system ensures fair market value for your innovative AI concepts.\n\nOur dynamic pricing algorithm analyzes market trends, similar idea valuations, and buyer demand to suggest optimal starting prices. Real-time bidding creates competitive environments that drive true market value.\n\nWith built-in escrow services and milestone-based payments, both buyers and sellers are protected throughout the transaction process, ensuring fair compensation for all parties.",
        },
      ],
    },
    whoIsThisFor: {
      title: "Who Is This For?",
      items: [
        {
          title: "Idea Creators",
          description: "Turn your AI concepts into revenue",
          details: "Researchers, developers, and visionaries who want to monetize their innovative AI ideas",
        },
        {
          title: "Tech Entrepreneurs",
          description: "Find your next breakthrough product",
          details: "Business leaders seeking cutting-edge AI solutions to build and scale",
        },
        {
          title: "Innovation Teams",
          description: "Access vetted AI concepts",
          details: "Corporate R&D teams looking for validated ideas to accelerate development",
        },
        {
          title: "Investors",
          description: "Discover early-stage opportunities",
          details: "VCs and angel investors seeking promising AI concepts before they hit the market",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          step: "1",
          title: "Submit Your Idea",
          description:
            "Upload your AI concept with our structured template. Your submission is automatically timestamped and protected with legal documentation.",
        },
        {
          step: "2",
          title: "Set Auction Terms",
          description:
            "Define your starting price, auction duration, and buyer requirements. Our system guides you through optimal pricing strategies.",
        },
        {
          step: "3",
          title: "Secure Transaction",
          description:
            "Complete the sale with our escrow service and comprehensive legal documentation. Full IP transfer with buyer protection guaranteed.",
        },
      ],
    },
  },
  ko: {
    hero: {
      title: "당신의 AI 비전을 가치로 바꾸세요",
      subtitle: "AI 컨셉을 안전하게 경매하는\n세계 최초의 마켓플레이스",
      description:
        "미래를 만들어갈 혁신가들과 연결하세요.\n당신의 아이디어는 보호받고, 인정받고,\n공정한 보상을 받을 자격이 있습니다.",
      cta1: "경매 시작하기",
      cta2: "마켓플레이스 둘러보기",
    },
    features: {
      title: "AI-dea Auction을 선택하는 이유",
      items: [
        {
          icon: Shield,
          title: "당신의 아이디어, 법적으로 보호됩니다",
          description:
            "저희는 3단계 보호 장치를 통해, 추상적인 아이디어를 거래 가능한 지식재산으로 전환합니다.\n\n(1) 아이디어의 문서화:\n구조화된 템플릿을 통해 아이디어를 구체적인 '기획안'으로 만들어 법적 보호의 기반을 다집니다.\n\n(2) 타임스탬프 기록:\n아이디어 제출 및 모든 열람 기록은 서버에 자동 저장되어, 분쟁 발생 시 명확한 증거가 됩니다.\n\n(3) 전자 NDA(비밀유지계약):\n모든 열람자는 아이디어의 상세 내용을 보기 전, 법적 효력을 갖는 비밀유지계약에 의무적으로 동의해야 합니다.",
        },
        {
          icon: Globe,
          title: "글로벌 마켓플레이스",
          description:
            "다국어 플랫폼에서 전 세계 혁신가들과 기업가들과 연결하세요.\n\n24시간 접근 가능한 마켓플레이스를 통해 다양한 시간대의 국제 구매자와 판매자들과 만나보세요. 다중 통화 및 결제 방식을 지원하여 글로벌 거래를 원활하고 안전하게 만듭니다.\n\n전 세계 AI 혁신가 커뮤니티의 다양한 관점과 시장 통찰력을 활용하여 아이디어의 잠재적 가치와 시장 도달 범위를 증대시키세요。",
        },
        {
          icon: TrendingUp,
          title: "공정한 가격",
          description:
            "투명한 경매 시스템으로 혁신적인 AI 컨셉의 공정한 시장 가치를 보장합니다.\n\n동적 가격 알고리즘이 시장 트렌드, 유사 아이디어 평가, 구매자 수요를 분석하여 최적의 시작 가격을 제안합니다. 실시간 입찰은 진정한 시장 가치를 창출하는 경쟁 환경을 조성합니다.\n\n내장된 에스크로 서비스와 단계별 결제 시스템으로 구매자와 판매자 모두 거래 과정 전반에 걸쳐 보호받으며, 모든 당사자에게 공정한 보상을 보장합니다.",
        },
      ],
    },
    whoIsThisFor: {
      title: "이런 분들을 위한 서비스입니다",
      items: [
        {
          title: "아이디어 창작자",
          description: "AI 컨셉을 수익으로 전환하세요",
          details: "혁신적인 AI 아이디어를 수익화하고 싶은 연구자, 개발자, 비전가들",
        },
        {
          title: "기술 기업가",
          description: "다음 혁신 제품을 찾아보세요",
          details: "구축하고 확장할 최첨단 AI 솔루션을 찾는 비즈니스 리더들",
        },
        {
          title: "혁신 팀",
          description: "검증된 AI 컨셉에 접근하세요",
          details: "개발을 가속화할 검증된 아이디어를 찾는 기업 R&D 팀들",
        },
        {
          title: "투자자",
          description: "초기 단계 기회를 발견하세요",
          details: "시장에 나오기 전 유망한 AI 컨셉을 찾는 VC와 엔젤 투자자들",
        },
      ],
    },
    howItWorks: {
      title: "작동 방식",
      steps: [
        {
          step: "1",
          title: "아이디어 제출",
          description:
            "구조화된 템플릿으로 AI 컨셉을 업로드하세요. 제출물은 자동으로 타임스탬프 처리되어 법적 문서로 보호됩니다.",
        },
        {
          step: "2",
          title: "경매 조건 설정",
          description:
            "시작 가격, 경매 기간, 구매자 요구사항을 정의하세요. 저희 시스템이 최적의 가격 전략을 안내해드립니다.",
        },
        {
          step: "3",
          title: "안전한 거래",
          description:
            "에스크로 서비스와 포괄적인 법적 문서로 판매를 완료하세요. 구매자 보호가 보장된 완전한 IP 이전이 이루어집니다.",
        },
      ],
    },
  },
}


export default function HomePage() {
  const { language } = useLanguage()
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  const [typedText1, setTypedText1] = useState("")
  const [typedText2, setTypedText2] = useState("")
  const [typedText3, setTypedText3] = useState("")
  const [showCursor1, setShowCursor1] = useState(true)
  const [showCursor2, setShowCursor2] = useState(false)
  const [showCursor3, setShowCursor3] = useState(false)

  const featuresRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const sections = [featuresRef.current, statsRef.current, howItWorksRef.current]
    sections.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  const currentContent = content[language as keyof typeof content] || content.en

  useEffect(() => {
    const texts = [currentContent.hero.title, currentContent.hero.subtitle, currentContent.hero.description]

    setTypedText1("")
    setTypedText2("")
    setTypedText3("")
    setShowCursor1(true)
    setShowCursor2(false)
    setShowCursor3(false)

    const typeText = async (text: string, setter: (value: string) => void, speed = 50) => {
      for (let i = 0; i <= text.length; i++) {
        setter(text.slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, speed))
      }
    }

    const runAnimation = async () => {
      await typeText(texts[0], setTypedText1, 50)
      setShowCursor1(false)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setShowCursor2(true)
      await typeText(texts[1], setTypedText2, 40)
      setShowCursor2(false)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setShowCursor3(true)
      await typeText(texts[2], setTypedText3, 30)
      setShowCursor3(false)
    }
    
    const timer = setTimeout(() => {
      runAnimation()
    }, 500)

    return () => clearTimeout(timer)
  }, [language, currentContent]) 

  return (
    <div className="min-h-screen relative">
      <div className="aurora-bg"></div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-primary/30">
            <Gavel className="w-4 h-4 mr-2" />
            Trusted AI Marketplace
          </Badge>

          <div className="text-left max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 min-h-[120px] md:min-h-[180px]">
              {typedText1}
              {showCursor1 && <span className="animate-pulse">|</span>}
            </h1>

            <div className="text-3xl md:text-5xl font-bold mb-6 min-h-[80px] md:min-h-[120px]">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
                <span className="whitespace-pre-line">
                  {typedText2}
                  {showCursor2 && <span className="animate-pulse text-primary">|</span>}
                </span>
              </span>
            </div>

            <p className="text-xl mb-8 max-w-3xl min-h-[60px] leading-relaxed bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent animate-gradient-x">
              <span className="whitespace-pre-line">
                {typedText3}
                {showCursor3 && <span className="animate-pulse">|</span>}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Link href="/ideas/submit">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
                {currentContent.hero.cta1}
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
              >
                {currentContent.hero.cta2}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className={`py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-16">{currentContent.features.title}</h2>
          <div className="space-y-12">
            {currentContent.features.items.map((feature, index) => (
              <Card
                key={index}
                className={`text-left hover:shadow-lg transition-all duration-700 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 max-w-3xl mx-auto ${
                  visibleSections.has("features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <feature.icon className="h-12 w-12 text-primary mr-4" />
                    <div>
                      <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <CardDescription className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section
        ref={statsRef}
        id="stats"
        className={`py-16 bg-card/20 backdrop-blur-sm transition-all duration-1000 ${
          visibleSections.has("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">{currentContent.whoIsThisFor.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.whoIsThisFor.items.map((item, index) => (
              <Card
                key={index}
                className={`text-center hover:shadow-lg transition-all duration-700 bg-card/30 backdrop-blur-sm border-border/30 hover:border-primary/30 ${
                  visibleSections.has("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-primary text-lg">{item.title}</CardTitle>
                  <CardDescription className="text-foreground font-medium">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={howItWorksRef}
        id="howItWorks"
        className={`py-20 bg-card/20 backdrop-blur-sm px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
          visibleSections.has("howItWorks") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">{currentContent.howItWorks.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {currentContent.howItWorks.steps.map((step, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-700 ${
                  visibleSections.has("howItWorks") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}