"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Shield, FileText, AlertTriangle, CheckCircle, Calendar, User } from "lucide-react"

interface NDAModalProps {
  isOpen: boolean
  onClose: () => void
  onSign: (signature: NDASignature) => void
  ideaTitle: string
  ideaId: string
}

interface NDASignature {
  fullName: string
  email: string
  company?: string
  purpose: string
  agreedToTerms: boolean
  timestamp: Date
}

export function NDAModal({ isOpen, onClose, onSign, ideaTitle, ideaId }: NDAModalProps) {
  const [step, setStep] = useState<"review" | "sign">("review")
  const [signature, setSignature] = useState<Partial<NDASignature>>({
    fullName: "",
    email: "",
    company: "",
    purpose: "",
    agreedToTerms: false,
  })

  const handleSign = () => {
    if (signature.fullName && signature.email && signature.purpose && signature.agreedToTerms) {
      onSign({
        ...signature,
        timestamp: new Date(),
      } as NDASignature)
      onClose()
      setStep("review")
      setSignature({
        fullName: "",
        email: "",
        company: "",
        purpose: "",
        agreedToTerms: false,
      })
    }
  }

  const ndaContent = `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${new Date().toLocaleDateString()} between AI-dea Auction Platform ("Disclosing Party") and the undersigned ("Receiving Party") regarding the confidential information related to:

IDEA: ${ideaTitle}
ID: ${ideaId}

1. CONFIDENTIAL INFORMATION
The Receiving Party acknowledges that they will have access to confidential and proprietary information including but not limited to:
- Technical specifications and implementation details
- Business models and market analysis
- Competitive advantages and unique features
- Implementation plans and timelines
- Any other information marked as confidential

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
- Keep all confidential information strictly confidential
- Not disclose any information to third parties without written consent
- Use the information solely for evaluation purposes
- Not reverse engineer or attempt to recreate the idea
- Return or destroy all confidential materials upon request

3. TERM
This Agreement shall remain in effect for a period of 5 years from the date of signing, unless terminated earlier by mutual consent.

4. REMEDIES
The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party, and that monetary damages may be inadequate. Therefore, the Disclosing Party shall be entitled to seek injunctive relief and other equitable remedies.

5. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

6. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements relating to the subject matter hereof.

By signing below, the Receiving Party acknowledges that they have read, understood, and agree to be bound by the terms of this Agreement.
  `

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Non-Disclosure Agreement
          </DialogTitle>
          <DialogDescription>
            Please review and sign the NDA to access confidential information about "{ideaTitle}"
          </DialogDescription>
        </DialogHeader>

        {step === "review" && (
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Legal Protection Notice
                </CardTitle>
                <CardDescription>
                  This idea is protected by intellectual property laws and this legally binding NDA. All access and
                  interactions are logged for legal purposes.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Legal Binding</div>
                  <div className="text-sm text-muted-foreground">Enforceable contract</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">5 Year Term</div>
                  <div className="text-sm text-muted-foreground">Long-term protection</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="font-semibold">Full Protection</div>
                  <div className="text-sm text-muted-foreground">IP rights secured</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>NDA Document</CardTitle>
                <CardDescription>Please read the complete agreement carefully</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 w-full border rounded-md p-4">
                  <pre className="text-sm whitespace-pre-wrap">{ndaContent}</pre>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={() => setStep("sign")}>
                <FileText className="h-4 w-4 mr-2" />
                Proceed to Sign
              </Button>
            </div>
          </div>
        )}

        {step === "sign" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Signature Information
                </CardTitle>
                <CardDescription>Please provide your information to complete the NDA signature</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Legal Name *</Label>
                    <Input
                      id="fullName"
                      value={signature.fullName}
                      onChange={(e) => setSignature((prev) => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full legal name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signature.email}
                      onChange={(e) => setSignature((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Company/Organization (Optional)</Label>
                  <Input
                    id="company"
                    value={signature.company}
                    onChange={(e) => setSignature((prev) => ({ ...prev, company: e.target.value }))}
                    placeholder="Enter your company or organization"
                  />
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose of Access *</Label>
                  <Textarea
                    id="purpose"
                    value={signature.purpose}
                    onChange={(e) => setSignature((prev) => ({ ...prev, purpose: e.target.value }))}
                    placeholder="Briefly describe why you want to access this idea (e.g., potential investment, partnership, licensing)"
                    className="min-h-20"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agree-terms"
                      checked={signature.agreedToTerms}
                      onCheckedChange={(checked) =>
                        setSignature((prev) => ({ ...prev, agreedToTerms: checked as boolean }))
                      }
                    />
                    <div>
                      <Label htmlFor="agree-terms" className="text-sm font-medium">
                        I agree to the terms of this Non-Disclosure Agreement *
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        By checking this box, you acknowledge that you have read, understood, and agree to be legally
                        bound by all terms and conditions of this NDA.
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-muted bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">Legal Consequences</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Violation of this NDA may result in legal action, including injunctive relief and monetary
                          damages. All activities are logged and monitored.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("review")}>
                Back to Review
              </Button>
              <div className="space-x-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSign}
                  disabled={!signature.fullName || !signature.email || !signature.purpose || !signature.agreedToTerms}
                  className="bg-primary"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Sign NDA
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
