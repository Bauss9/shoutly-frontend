// ProfilePageClient.tsx
'use client';

import { CheckCircle2, Clock, MessageSquare, Star, Bell, Euro, Play, Send, CreditCard, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rg3DD2HrJO8PWbW6aEleYGfxFWyHM6lZQUAJUdZ4VGoQ4E0b3fx42laYOOaPgiCcJv1rVi11PF0yeFyd1yxhUzb002xNpeyXw');

interface ShoutoutOption {
  id: string;
  title: string;
  duration: number;
  price: number;
  sort_order: number;
}

interface ShoutoutSettings {
  shoutout_mode_active: boolean;
  is_unlimited: boolean;
  max_quantity: string | null;
}

interface PublicProfile {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_image_original?: string;
  profile_image_thumbnail?: string;
  profile_image_small?: string;
  instagram_username?: string;
  tiktok_username?: string;
  youtube_username?: string;
  twitter_username?: string;
  twitch_username?: string;
  rating: number;
  completed_shoutouts: number;
  is_verified: boolean;
  created_at: string;
}

interface ProfileData {
  profile: PublicProfile;
  shoutoutSettings: ShoutoutSettings;
  shoutoutOptions: ShoutoutOption[];
}

// Stripe service functions
const createPaymentIntent = async (data: {
  optionId: string;
  creatorId: number;
  buyerEmail: string;
  buyerName: string;
  message?: string;
  scriptText?: string;
  shoutoutType: 'script' | 'creative';
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  try {

    console.log('This is the data:', JSON.stringify({
              optionId: data.optionId,
        creatorId: data.creatorId,
        buyerEmail: data.buyerEmail,
        buyerName: data.buyerName,
        message: data.message,
        metadata: {
          shoutoutType: data.shoutoutType,
          scriptText: data.scriptText
        }
    }))
    const response = await fetch(`${baseUrl}/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optionId: data.optionId,
        creatorId: data.creatorId,
        buyerEmail: data.buyerEmail,
        buyerName: data.buyerName,
        message: data.message,
        metadata: {
          shoutoutType: data.shoutoutType,
          scriptText: data.scriptText
        }
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating payment intent:', error);
return {
  success: false,
  message: 'Fehler beim Erstellen der Zahlungsabsicht',
  error: 'NETWORK_ERROR'
};
  }
};

// Payment Form Component
function PaymentForm({ 
  clientSecret, 
  onSuccess, 
  onError, 
  onCancel, 
  orderDetails 
}: {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
  orderDetails: {
    creatorName: string;
    optionTitle: string;
    price: number;
    buyerEmail: string;
  };
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
          receipt_email: orderDetails.buyerEmail,
        },
        redirect: 'if_required'
      });

      if (error) {
        console.error('Payment error:', error);
        setPaymentStatus('failed');
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentStatus('succeeded');
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setPaymentStatus('failed');
onError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setIsProcessing(false);
    }
  };

if (paymentStatus === 'succeeded') {
  return (
    <div className="text-center py-8">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Zahlung erfolgreich!</h3>
      <p className="text-gray-600">Deine Shoutout-Bestellung wurde erfolgreich aufgegeben.</p>
    </div>
  );
}



// 2. Replace PaymentForm failed state:
if (paymentStatus === 'failed') {
  return (
    <div className="text-center py-8">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Zahlung fehlgeschlagen</h3>
      <p className="text-gray-600 mb-4">Bitte versuche es erneut oder verwende eine andere Zahlungsmethode.</p>
      <button
        onClick={() => setPaymentStatus('idle')}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
      >
        Erneut versuchen
      </button>
    </div>
  );
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
<div className="bg-gray-50 rounded-lg p-4">
  <h3 className="font-semibold text-gray-900 mb-2">Bestellübersicht</h3>
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">Creator:</span>
      <span className="font-medium">{orderDetails.creatorName}</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-600">Shoutout:</span>
      <span className="font-medium">{orderDetails.optionTitle}</span>
    </div>
    <div className="flex justify-between font-semibold text-lg border-t pt-2">
      <span>Gesamt:</span>
      <span>€{orderDetails.price}</span>
    </div>
  </div>
</div>

      {/* Payment Element */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-700">
  <CreditCard className="w-5 h-5" />
  <span className="font-medium">Zahlungsdetails</span>
        </div>
        <PaymentElement />
      </div>

      {/* Payment Buttons */}
<div className="flex gap-3 pt-4">
  <button
    type="button"
    onClick={onCancel}
    disabled={isProcessing}
    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
  >
    Abbrechen
  </button>
  <button
    type="submit"
    disabled={!stripe || isProcessing}
    className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
  >
    {isProcessing ? (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Wird verarbeitet...
      </>
    ) : (
      <>
        <CreditCard className="w-4 h-4" />
        €{orderDetails.price} bezahlen
      </>
    )}
  </button>
</div>
    </form>
  );
}

// Payment Modal Component
function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  clientSecret,
  orderDetails
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  clientSecret: string;
  orderDetails: {
    creatorName: string;
    optionTitle: string;
    price: number;
    buyerEmail: string;
  };
}) {
  if (!isOpen) return null;

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-bold text-gray-900">Zahlung abschließen</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              clientSecret={clientSecret}
              onSuccess={onSuccess}
              onError={onError}
              onCancel={onClose}
              orderDetails={orderDetails}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
}

// Order Modal Component
function OrderModal({ 
  option, 
  profile, 
  isOpen, 
  onClose, 
  onPaymentSuccess 
}: {
  option: ShoutoutOption;
  profile: PublicProfile;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paymentIntentId: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [shoutoutType, setShoutoutType] = useState<'script' | 'creative'>('creative');
  const [scriptText, setScriptText] = useState('');
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsCreatingPayment(true);
    setPaymentError('');

    try {
      const result = await createPaymentIntent({
        optionId: option.id,
        creatorId: profile.id,
        buyerEmail: email,
        buyerName: name,
        message: shoutoutType === 'creative' ? message : '',
        scriptText: shoutoutType === 'script' ? scriptText : '',
        shoutoutType: shoutoutType
      });

      if (result.success && result.data) {
        setClientSecret(result.data.clientSecret);
        setShowPaymentModal(true);
      } else {
        setPaymentError(result.message || 'Failed to create payment');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
setPaymentError('Fehler beim Erstellen der Zahlung. Bitte versuche es erneut.');
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setShowPaymentModal(false);
    onPaymentSuccess(paymentIntentId);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setShowPaymentModal(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Shoutout bestellen</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">
{option.title || 'Personalisierter Shoutout'}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(option.duration)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                    <Euro className="w-4 h-4" />
                    {option.price}
                  </div>
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {paymentError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  📧 <span>Deine E-Mail-Adresse</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Hierhin senden wir dir den Shoutout-Link."
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Shoutout Type Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  🎬 <span>Wie soll der Creator deinen Shoutout gestalten?</span>
                </label>
                
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="shoutoutType"
                      value="script"
                      checked={shoutoutType === 'script'}
                      onChange={(e) => setShoutoutType(e.target.value as 'script')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Fester Text (du gibst genau vor, was gesagt werden soll)</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="shoutoutType"
                      value="creative"
                      checked={shoutoutType === 'creative'}
                      onChange={(e) => setShoutoutType(e.target.value as 'creative')}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Freie Kreativität (du gibst nur grobe Infos, der Creator macht den Rest)</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Script Text - Only show when "Fester Text" is selected */}
              {shoutoutType === 'script' && (
                <div>
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Wenn du „Fester Text" gewählt hast:
                    </div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      📝 <span>Dein gewünschter Text:</span>
                    </label>
                  </div>
                  <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Schreib hier genau, was der Creator sagen soll (inkl. Aussprache, Tonalität etc.)."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  />
                </div>
              )}

                  <div>
                    <div className="mb-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        💬 <span>Dein Name:</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Wie soll dich der Creator nennen?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
              {/* Creative Fields - Only show when "Freie Kreativität" is selected */}
              {shoutoutType === 'creative' && (
                <>

                                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Wenn du „Freie Kreativität" gewählt hast:
                      </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                      🎯 <span>Grober Wunsch / Thema:</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Worum soll es gehen? Z. B. Motivation, Spaß, Geburtstag, Insider etc."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                    />
                  </div>
                </>
              )}

              {/* Delivery Info */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🔒</span>
                  <div className="text-sm">
                    <div className="font-medium text-amber-800 mb-1">Hinweis:</div>
                    <div className="text-amber-700">
                      Der Creator hat <strong>48 Stunden</strong>, um deinen Shoutout zu liefern. Danach kannst du{' '}
                      <strong>kostenlos stornieren</strong>, falls noch nichts angekommen ist.
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  disabled={!email || isCreatingPayment}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-300 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
{isCreatingPayment ? (
  <>
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    Zahlung wird vorbereitet...
  </>
) : (
  <>
    <Send className="w-4 h-4" />
    Zur Zahlung
  </>
)}

                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        clientSecret={clientSecret}
        orderDetails={{
          creatorName: getDisplayName(profile),
optionTitle: option.title || 'Personalisierter Shoutout',
          price: option.price,
          buyerEmail: email
        }}
      />
    </>
  );
}

function getDisplayName(profile: PublicProfile): string {
  if (profile.first_name || profile.last_name) {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  }
  return profile.username;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} Sek`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')} Min` : `${minutes} Min`;
}

function getAvailabilityStatus(settings: ShoutoutSettings): { status: string; message: string; color: string } {
  if (!settings.shoutout_mode_active) {
    return {
      status: 'Nicht verfügbar',
      message: 'Shoutouts sind derzeit nicht verfügbar',
      color: 'text-gray-500'
    };
  }

  if (settings.is_unlimited) {
    return {
      status: 'Verfügbar',
      message: 'Unbegrenzt verfügbar',
      color: 'text-emerald-600'
    };
  }

  const remaining = settings.max_quantity ? parseInt(settings.max_quantity) : 0;
  if (remaining <= 0) {
    return {
      status: 'Ausverkauft',
      message: 'Alle Plätze belegt',
      color: 'text-red-500'
    };
  }

  return {
    status: 'Verfügbar',
    message: `${remaining} Plätze verfügbar`,
    color: 'text-emerald-600'
  };
}

export default function ProfilePageClient(props: { 
  profileData: ProfileData;
  username: string; 
}) {
  const { profileData, username } = props;
  const { profile, shoutoutSettings, shoutoutOptions } = profileData;
  const displayName = getDisplayName(profile);
  const availability = getAvailabilityStatus(shoutoutSettings);
  const router = useRouter();
  
  const [selectedOption, setSelectedOption] = useState<ShoutoutOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrderClick = (option: ShoutoutOption) => {
    setSelectedOption(option);
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    // Close modal and redirect to success page
    setIsModalOpen(false);
    setSelectedOption(null);
    
    // Redirect to success page with payment intent ID
    router.push(`/payment-success?payment_intent=${paymentIntentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                {profile.profile_image_thumbnail || profile.profile_image_original ? (
                  <Image
                    src={profile.profile_image_thumbnail || profile.profile_image_original}
                    alt={displayName}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {profile.is_verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {displayName}
              </h1>
              <p className="text-lg text-gray-300 mb-4">@{profile.username}</p>
              
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <Play className="w-4 h-4" />
                  <span className="font-semibold">{profile.completed_shoutouts}</span>
                  <span className="text-gray-400">Shoutouts</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold">{Number(profile.rating).toFixed(1)}</span>
                  <span className="text-gray-400">Bewertung</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${shoutoutSettings.shoutout_mode_active ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                  <span className={availability.color + ' font-medium'}>{availability.status}</span>
                </div>
              </div>

              {profile.bio && (
                <p className="text-gray-300 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Shoutout Options */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shoutout Optionen</h2>
          
          {!shoutoutSettings.shoutout_mode_active ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Derzeit nicht verfügbar
              </h3>
              <p className="text-gray-600 mb-6">
                {displayName} nimmt momentan keine neuen Shoutout-Anfragen an.
              </p>
<button className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors">
                <Bell className="w-4 h-4" />
                Benachrichtigen wenn verfügbar
              </button>
            </div>
          ) : shoutoutOptions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Keine Optionen verfügbar
              </h3>
              <p className="text-gray-600">
                Shoutout-Optionen werden gerade konfiguriert.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-emerald-800 font-medium">{availability.message}</span>
                </div>
              </div>

              <div className="space-y-4">
                {shoutoutOptions.map((option, index) => (
                  <div 
                    key={option.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {option.title || `Shoutout Option ${index + 1}`}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(option.duration)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                        <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                          <Euro className="w-5 h-5" />
                          <span>{option.price}</span>
                        </div>
                        
                        <button 
                          onClick={() => handleOrderClick(option)}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap"
                        >
                          Jetzt bestellen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Social Media */}
        {(profile.instagram_username || profile.tiktok_username || profile.youtube_username || profile.twitter_username || profile.twitch_username) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-wrap gap-4">
                {profile.instagram_username && (
                  <a 
                    href={`https://instagram.com/${profile.instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>📷</span>
                    @{profile.instagram_username}
                  </a>
                )}
                
                {profile.tiktok_username && (
                  <a 
                    href={`https://tiktok.com/@${profile.tiktok_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>🎵</span>
                    @{profile.tiktok_username}
                  </a>
                )}
                
                {profile.youtube_username && (
                  <a 
                    href={`https://youtube.com/@${profile.youtube_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>🎥</span>
                    @{profile.youtube_username}
                  </a>
                )}
                
                {profile.twitter_username && (
                  <a 
                    href={`https://twitter.com/${profile.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>🐦</span>
                    @{profile.twitter_username}
                  </a>
                )}
                
                {profile.twitch_username && (
                  <a 
                    href={`https://twitch.tv/${profile.twitch_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <span>🎮</span>
                    @{profile.twitch_username}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trust & Safety */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Verifizierter Creator</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Schnelle Bearbeitung</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Top bewertet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {selectedOption && (
        <OrderModal
          option={selectedOption}
          profile={profile}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOption(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
