// src/app/success/page.tsx

'use client';

import { CheckCircle, Copy, Mail, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  
  // Generate random order details
  const orderId = searchParams.get('orderId') || `SHT${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const transactionId = `PAY-${Math.random().toString(36).substr(2, 12).toUpperCase()}`;
  const userEmail = 'hs@test.com'; // In real app, get from order data

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="relative max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-fadeIn">
          {/* Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse-slow" />
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-6">
              <CheckCircle className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            Zahlung erfolgreich!
          </h1>
          
          <p className="text-gray-600 mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            Deine Bestellung wurde erfolgreich aufgegeben. Du erhältst in Kürze eine Bestätigungs-E-Mail.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-left space-y-4 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <div>
              <p className="text-sm text-gray-500 mb-1">Bestellnummer</p>
              <div className="flex items-center justify-between">
                <p className="font-mono font-semibold text-gray-900">{orderId}</p>
                <button
                  onClick={copyOrderId}
                  className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-all"
                  title="Kopieren"
                >
                  {copied ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">PayPal Transaktions-ID</p>
              <p className="font-mono text-sm text-gray-700">{transactionId}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">E-Mail für Lieferung</p>
              <p className="font-medium text-gray-900">{userEmail}</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 text-left animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Was passiert als Nächstes?
            </h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex gap-2">
                <span className="font-semibold">1.</span>
                <span>Der Creator erhält deine Anfrage und Nachricht</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">2.</span>
                <span>Das Video wird innerhalb von 24 Stunden aufgenommen</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">3.</span>
                <span>Du erhältst das fertige Video per E-Mail an {userEmail}</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">4.</span>
                <span>Du kannst das Video herunterladen und teilen!</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 animate-fadeIn" style={{ animationDelay: '500ms' }}>
            <Link
              href="/"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Weitere Shoutouts entdecken
            </Link>
            
            <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Diese Seite teilen
            </button>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-500 mt-8 animate-fadeIn" style={{ animationDelay: '600ms' }}>
            Bei Fragen zu deiner Bestellung kontaktiere uns unter{' '}
            <a href="mailto:support@shoutly.co" className="text-blue-600 hover:underline">
              support@shoutly.co
            </a>
          </p>
        </div>

        {/* Celebration Effects */}
        <div className="absolute -top-10 -left-10 text-6xl animate-bounce" style={{ animationDelay: '700ms' }}>
          🎉
        </div>
        <div className="absolute -top-10 -right-10 text-6xl animate-bounce" style={{ animationDelay: '800ms' }}>
          🎊
        </div>
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce" style={{ animationDelay: '900ms' }}>
          ✨
        </div>
      </div>
    </div>
  );
}