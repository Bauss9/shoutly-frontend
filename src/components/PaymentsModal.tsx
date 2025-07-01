// components/PaymentModal.tsx - German Version
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle2, AlertCircle, CreditCard, X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rg3DD2HrJO8PWbW6aEleYGfxFWyHM6lZQUAJUdZ4VGoQ4E0b3fx42laYOOaPgiCcJv1rVi11PF0yeFyd1yxhUzb002xNpeyXw');

interface PaymentFormProps {
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
}

function PaymentForm({ clientSecret, onSuccess, onError, onCancel, orderDetails }: PaymentFormProps) {
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
        onError(error.message || 'Zahlung fehlgeschlagen');
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

interface PaymentModalProps {
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
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  clientSecret,
  orderDetails
}: PaymentModalProps) {
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