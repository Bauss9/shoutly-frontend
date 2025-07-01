'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Mail, User, Play, Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OrderStatusClientProps {
  orderNumber: string;
}

interface OrderData {
  order: {
    id: number;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    amount: number;
    duration: number;
    message: string;
    videoUrl?: string;
    deliveryDate?: string;
    completedAt?: string;
    createdAt: string;
    isOverdue: boolean;
    deliveryDeadline: string;
    buyerName: string;
    buyerEmail: string;
  };
  creator: {
    username: string;
    displayName: string;
    profileImage?: string;
  };
  option: {
    title: string;
  };
  payment: {
    method?: string;
    customerId?: string;
  };
}

export default function OrderStatusClient({ orderNumber }: OrderStatusClientProps) {
  const [email, setEmail] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await fetch(`${baseUrl}/public/orders/${orderNumber}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderData(result.data);
        setIsVerified(true);
      } else {
        setError(result.message || 'Bestellung nicht gefunden');
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Wartend';
      case 'in_progress': return 'In Bearbeitung';
      case 'delivered': return 'Geliefert';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'in_progress': return <Play className="w-5 h-5" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5" />;
      case 'cancelled': return <AlertCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bestellstatus prüfen
              </h1>
              <p className="text-gray-600">
                Bestellung: <span className="font-mono font-semibold">{orderNumber}</span>
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deine E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Gib die E-Mail-Adresse ein, mit der du bestellt hast"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!email || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Wird überprüft...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Status anzeigen
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück zur Startseite
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Bestellstatus
          </h1>
          <p className="text-gray-600 mt-1">
            Bestellung: <span className="font-mono font-semibold">{orderData.order.orderNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Aktueller Status</h2>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(orderData.order.status)}`}>
                  {getStatusIcon(orderData.order.status)}
                  <span className="font-medium">{getStatusText(orderData.order.status)}</span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Zahlung bestätigt</div>
                    <div className="text-sm text-gray-600">{formatDate(orderData.order.createdAt)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['in_progress', 'delivered'].includes(orderData.order.status)
                      ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Play className={`w-5 h-5 ${
                      ['in_progress', 'delivered'].includes(orderData.order.status)
                        ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">In Bearbeitung</div>
                    <div className="text-sm text-gray-600">
                      {orderData.order.status === 'in_progress' ? 'Wird gerade bearbeitet' : 
                       orderData.order.status === 'delivered' ? 'Abgeschlossen' : 'Wartend'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    orderData.order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <CheckCircle2 className={`w-5 h-5 ${
                      orderData.order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Video geliefert</div>
                    <div className="text-sm text-gray-600">
                      {orderData.order.deliveryDate 
                        ? formatDate(orderData.order.deliveryDate)
                        : 'Noch nicht geliefert'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Deadline */}
              {orderData.order.status !== 'delivered' && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  orderData.order.isOverdue 
                    ? 'bg-red-50 border-red-200 text-red-800' 
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                      {orderData.order.isOverdue 
                        ? 'Lieferung überfällig' 
                        : 'Lieferung bis'
                      }
                    </span>
                  </div>
                  <div className="text-sm mt-1">
                    {formatDate(orderData.order.deliveryDeadline)}
                  </div>
                </div>
              )}

              {/* Video Download */}
              {orderData.order.videoUrl && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-green-800">Dein Video ist da! 🎉</div>
                      <div className="text-sm text-green-700">Klicke hier, um dein Video anzusehen</div>
                    </div>
                    <a
                      href={orderData.order.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Video ansehen
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bestelldetails</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Betrag</span>
                  <span className="font-semibold">€{orderData.order.amount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Dauer</span>
                  <span className="font-semibold">{orderData.order.duration}s</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Zahlungsstatus</span>
                  <span className="font-semibold text-green-600">
                    {orderData.order.paymentStatus === 'completed' ? 'Bezahlt' : orderData.order.paymentStatus}
                  </span>
                </div>

                {orderData.order.message && (
                  <div>
                    <div className="text-gray-600 mb-2">Nachricht</div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      {orderData.order.message}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Creator Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Creator</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  {orderData.creator.profileImage ? (
                    <Image
                      src={orderData.creator.profileImage}
                      alt={orderData.creator.displayName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">
                    {orderData.creator.displayName}
                  </div>
                  <div className="text-sm text-gray-600">
                    @{orderData.creator.username}
                  </div>
                </div>
              </div>
              
              {orderData.option.title && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">Option</div>
                  <div className="font-medium">{orderData.option.title}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}