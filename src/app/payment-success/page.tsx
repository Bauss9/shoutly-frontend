// src/app/payment-success/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowLeft, Mail, Clock, Copy } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const paymentIntentId = searchParams.get('payment_intent');

  useEffect(() => {
    if (paymentIntentId) {
      fetchOrderData(paymentIntentId);
    } else {
      setLoading(false);
    }
  }, [paymentIntentId]);

  const fetchOrderData = async (paymentIntentId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${baseUrl}/payments/${paymentIntentId}`);
      const result = await response.json();
      
      if (result.success) {
        setOrderData(result.data);
      }
    } catch (error) {
      console.error('Error fetching order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    if (orderData?.payment?.metadata?.orderNumber) {
      navigator.clipboard.writeText(orderData.payment.metadata.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
      
      <div className="max-w-md mx-auto relative">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Zahlung erfolgreich! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8">
            Deine Shoutout-Bestellung wurde erfolgreich aufgegeben. Du erhältst dein personalisiertes Video innerhalb von 48 Stunden.
          </p>

          {/* Order Details */}
          {orderData && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Bestelldetails</h3>
              
              {orderData.payment?.metadata?.orderNumber && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bestellnummer</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-semibold text-gray-900">
                      {orderData.payment.metadata.orderNumber}
                    </p>
                    <button
                      onClick={copyOrderNumber}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-all"
                      title="Kopieren"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500 mb-1">E-Mail</p>
                <p className="font-medium text-gray-900">{orderData.payment?.buyer_email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Betrag</p>
                <p className="font-semibold text-gray-900">€{orderData.payment?.amount}</p>
              </div>

              {paymentIntentId && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Zahlungs-ID</p>
                  <p className="font-mono text-xs text-gray-700">{paymentIntentId}</p>
                </div>
              )}
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Was passiert als Nächstes?
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Der Creator wird über deine Bestellung benachrichtigt</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Dein personalisiertes Video wird erstellt</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Du erhältst eine E-Mail mit dem Video-Link</span>
              </div>
            </div>
          </div>

          {/* Email confirmation */}
          {orderData?.payment?.buyer_email && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 text-amber-800 mb-2">
                <Mail className="w-4 h-4" />
                <span className="font-medium">Bestätigungs-E-Mail</span>
              </div>
              <p className="text-sm text-amber-700">
                Eine Bestätigung wurde an <strong>{orderData.payment.buyer_email}</strong> gesendet.
                Prüfe auch deinen Spam-Ordner!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Startseite
            </button>
            
            <p className="text-xs text-gray-500">
              Bei Fragen kannst du uns jederzeit kontaktieren.
            </p>
          </div>
        </div>

        {/* Celebration Effects */}
        <div className="absolute top-4 left-4 text-4xl animate-bounce pointer-events-none">
          🎉
        </div>
        <div className="absolute top-4 right-4 text-4xl animate-bounce pointer-events-none">
          🎊
        </div>
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-4xl animate-bounce pointer-events-none">
          ✨
        </div>
      </div>
    </div>
  );
}