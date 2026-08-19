import api from './api';

export interface CheckoutSessionResponse {
  message: string;
  url?: string;
  sessionId?: string;
  paymentId?: number;
}

/**
 * Initiate Stripe Checkout session for a course
 */
export const createCheckoutSession = async (courseId: number, customFrontendUrl?: string): Promise<CheckoutSessionResponse> => {
  try {
    const frontendUrl = customFrontendUrl || (typeof window !== 'undefined' ? window.location.origin : undefined);
    const response = await api.post<CheckoutSessionResponse>('/payments/checkout-session', { 
      courseId,
      frontendUrl
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create checkout session via API:", error);
    throw error;
  }
};

/**
 * Verify payment status after Stripe redirect
 */
export const verifyPayment = async (sessionId: string, paymentId: number) => {
  try {
    const response = await api.post('/payments/verify', { sessionId, paymentId });
    return response.data;
  } catch (error) {
    console.error("Failed to verify payment via API:", error);
    throw error;
  }
};

/**
 * Get payment history for the current user
 */
export const getUserPayments = async () => {
  try {
    const response = await api.get('/payments/history');
    return response.data.payments || [];
  } catch (error) {
    console.warn("Failed to fetch payment history:", error);
    return [];
  }
};
