import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rg3DD2HrJO8PWbW6aEleYGfxFWyHM6lZQUAJUdZ4VGoQ4E0b3fx42laYOOaPgiCcJv1rVi11PF0yeFyd1yxhUzb002xNpeyXw');

export interface CreatePaymentIntentRequest {
  optionId: string;
  creatorId: number;
  buyerEmail: string;
  buyerName: string;
  message?: string;
  scriptText?: string;
  shoutoutType: 'script' | 'creative';
}

export interface PaymentIntentResponse {
  success: boolean;
  message: string;
  data?: {
    clientSecret: string;
    paymentIntentId: string;
  };
  error?: string;
}

export const createPaymentIntent = async (data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  
  try {
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
      message: 'Failed to create payment intent',
      error: 'NETWORK_ERROR'
    };
  }
};

export const getStripe = () => stripePromise;