import httpServices from '../httpServices';

const baseUrl = import.meta.env.VITE_BASE_URL_V1 || "http://13.201.30.164/api/v1";

export function useRazorpay() {
  const openCheckout = (data) => {
    const rzp = new window.Razorpay({
      key:      data.key_id,
      amount:   data.amount,
      currency: data.currency,
      order_id: data.razorpay_order_id,
      name:     'Studio App',
      prefill:  data.prefill,

      handler: () => {
        data.onSuccess();
      },

      modal: {
        ondismiss: async () => {
          try {
            const orderId = data.order_id || data.id;
            await httpServices.post(`${baseUrl}/order/${orderId}/cancel-payment`);
          } catch (err) {
            console.error("Failed to cancel payment:", err);
          }
          data.onDismiss();
        },
      },
    });

    rzp.open();
  };

  return { openCheckout };
}
