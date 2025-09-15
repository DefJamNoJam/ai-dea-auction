"use client";

import { useState, useEffect } from "react";
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from "aws-amplify/auth";
// import * as queries from '@/graphql/queries';
// import { type Transaction } from '@/API';
import { post } from 'aws-amplify/api'; // REST API 호출을 위한 post 함수

// Stripe 라이브러리 import
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CreditCard, PlusCircle } from "lucide-react";

const client = generateClient();

// ⚠️ 여기에 본인의 Stripe '게시 가능한 키' (pk_test_...)를 붙여넣으세요!
const stripePromise = loadStripe('pk_test_51S0PpHIdKyhBrAxi6wlXKmTPX0EgVG7KotKDuXKsCzO7B42kVOdEyq32SWjB9PCZkHSFvl2CoAXLalBjiwCEdKt100fmdotwqx');

// Stripe 결제 폼 컴포넌트
const CheckoutForm = ({ onSuccess, onCancel }: { onSuccess: (paymentMethod: any) => void, onCancel: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // 1. 우리 백엔드(Lambda)에 Setup Intent 생성을 요청
      const restOperation = post({
        apiName: "stripeapi",
        path: "/create-setup-intent"
      });
      const response = await restOperation.response;
      const { clientSecret } = (await response.body.json()) as { clientSecret: string };

      // 2. 받은 clientSecret과 카드 정보로 Stripe에 결제 수단 등록 요청
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { setupIntent, error: setupError } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (setupError) {
        throw setupError;
      }

      // 3. 성공 시, 부모 컴포넌트로 결제 수단 정보 전달
      onSuccess(setupIntent.payment_method);
      
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!stripe || processing}>
          {processing ? 'Saving...' : 'Save Card'}
        </Button>
      </DialogFooter>
    </form>
  );
};


export default function BillingPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // ... (거래 내역을 가져오는 로직은 그대로)
  }, []);

  return (
    // Stripe Elements Provider로 감싸기
    <Elements stripe={stripePromise}>
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>The primary payment method used for your transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethod ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{paymentMethod.card.brand.toUpperCase()} ending in {paymentMethod.card.last4}</p>
                            <p className="text-sm text-muted-foreground">Expires {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year}</p>
                        </div>
                    </div>
                    <Button variant="outline">Update</Button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8 px-4 border-2 border-dashed rounded-lg">
                  <p className="mb-4">No payment method has been added yet.</p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Add a new Payment Method</DialogTitle>
                      <DialogDescription>
                          Your payment details are securely handled by Stripe.
                      </DialogDescription>
                  </DialogHeader>
                  <CheckoutForm 
                    onSuccess={(method) => {
                        setPaymentMethod(method);
                        setIsModalOpen(false);
                    }}
                    onCancel={() => setIsModalOpen(false)}
                  />
              </DialogContent>
          </Dialog>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              {/* ... (거래 내역 부분은 기존 코드와 동일) ... */}
            </CardHeader>
            <CardContent>
              {/* ... */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Elements>
  );
}