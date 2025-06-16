// src/app/campaign/[id]/page.tsx

'use client';

import { Campaign, User } from '@/types';
import { ArrowLeft, CheckCircle2, Clock, Info, MessageSquare, Shield, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Mock data - replace with actual API call
const mockCampaign: Campaign & { user: User } = {
  id: 1,
  user_id: 1,
  category_id: 1,
  custom_title: null,
  is_active: true,
  is_unlimited: true,
  max_shoutouts: null,
  shoutouts_sold: 156,
  expires_at: null,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  category: {
    id: 1,
    slug: 'birthday',
    name: 'Geburtstags-Grüße',
    description: 'Persönliche Geburtstagswünsche',
  },
  priceOptions: [
    { id: 1, campaign_id: 1, duration_seconds: 30, price: 25, is_active: true },
    { id: 2, campaign_id: 1, duration_seconds: 60, price: 40, is_active: true },
    { id: 3, campaign_id: 1, duration_seconds: 120, price: 65, is_active: true },
  ],
  user: {
    id: 1,
    username: 'hs',
    email: 'hs@test.com',
    profile_picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maxmustermann',
    bio: 'Content Creator',
    is_verified: true,
    created_at: '2024-01-01',
  },
};

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} Sekunden`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) return `${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} Minuten`;
}

export default function CampaignPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(mockCampaign.priceOptions?.[0]);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const campaign = mockCampaign; // In real app, fetch based on params.id

  const handlePayment = async () => {
    if (!selectedOption) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // In real app, integrate with PayPal
      router.push(`/success?orderId=${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href={`/${campaign.user.username}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Zurück zum Profil</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Sicherer Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Campaign Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={campaign.user.profile_picture || '/default-avatar.png'}
                      alt={campaign.user.username}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  {campaign.user.is_verified && (
                    <CheckCircle2 className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-500 bg-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {campaign.category?.name || campaign.custom_title}
                  </h1>
                  <p className="text-gray-600">
                    von <Link href={`/${campaign.user.username}`} className="text-blue-600 hover:underline font-medium">
                      @{campaign.user.username}
                    </Link>
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">4.9</span>
                      <span className="text-gray-500">(234 Bewertungen)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{campaign.shoutouts_sold} Shoutouts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Deine Nachricht
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Was soll {campaign.user.username} in deinem Shoutout sagen?
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder={`Zum Beispiel:\n\n"Hallo Lisa! Alles Gute zum 25. Geburtstag! Ich wünsche dir..."\n\noder einfach Stichpunkte mit den wichtigsten Infos.`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {1000 - message.length} Zeichen übrig
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Tipps für eine tolle Nachricht:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Nenne den Namen der Person</li>
                      <li>Erwähne den Anlass (Geburtstag, Motivation, etc.)</li>
                      <li>Füge persönliche Details hinzu</li>
                      <li>Halte es authentisch und freundlich</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <div className="bg-white rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">24h Lieferung</p>
                <p className="text-xs text-gray-500">Schnell & zuverlässig</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">100% Sicher</p>
                <p className="text-xs text-gray-500">PayPal Käuferschutz</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Garantiert</p>
                <p className="text-xs text-gray-500">Oder Geld zurück</p>
              </div>
            </div>
          </div>

          {/* Right Column - Price Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-fadeIn" style={{ animationDelay: '150ms' }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Wähle deine Option
              </h3>

              {/* Price Options */}
              <div className="space-y-3 mb-6">
                {campaign.priceOptions?.map((option) => (
                  <label
                    key={option.id}
                    className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedOption?.id === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="price-option"
                      value={option.id}
                      checked={selectedOption?.id === option.id}
                      onChange={() => setSelectedOption(option)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption?.id === option.id
                          ? 'border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedOption?.id === option.id && (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDuration(option.duration_seconds)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Video-Länge
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        €{option.price}
                      </p>
                      {option.duration_seconds === 60 && (
                        <p className="text-xs text-green-600 font-medium">
                          Beliebteste Wahl
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Zwischensumme</span>
                  <span className="font-medium">€{selectedOption?.price || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Bearbeitungsgebühr</span>
                  <span className="font-medium">€0</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">Gesamt</span>
                  <span className="text-lg font-bold text-blue-600">
                    €{selectedOption?.price || 0}
                  </span>
                </div>
              </div>

              {/* PayPal Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedOption || !message.trim() || isProcessing}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedOption && message.trim() && !isProcessing
                    ? 'bg-[#0070ba] hover:bg-[#003087] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verarbeitung...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72c.07-.37.39-.634.77-.634h6.03c3.77 0 6.53 1.67 6.53 5.18 0 4.48-3.4 6.12-6.77 6.12h-2.1l-.93 6.27a.641.641 0 0 1-.633.54zm1.13-11.42h1.84c1.92 0 3.32-.73 3.32-2.86 0-1.53-1.04-2.29-2.69-2.29H8.36l-1.15 5.15zm13.73 11.42h-4.49a.64.64 0 0 1-.63-.63l.01-.09L19.4 4.72c.04-.2.21-.35.41-.35h4.28c.2 0 .37.15.41.35l2.3 15.01a.64.64 0 0 1-.63.74h-3.94l-.26-1.74h-2.44l-.61 1.74zm1.52-4.75h1.66l-.83-5.5-.83 5.5z"/>
                    </svg>
                    Mit PayPal bezahlen
                  </>
                )}
              </button>

              {/* Additional Info */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Nach der Zahlung erhältst du dein Video innerhalb von 24 Stunden per E-Mail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}