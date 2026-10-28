import { Page } from '@playwright/test';
import { createHmac } from 'crypto';

export async function stubRazorpay(page: Page, keySecret: string) {
  // Node signs the payment the same way Razorpay does: HMAC-SHA256 of "orderId|paymentId"
  await page.exposeFunction('signPayment', (orderId: string, paymentId: string) =>
    createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex')
  );

  // Replace Razorpay's checkout script with a stand-in that "pays" instantly
  await page.route('https://checkout.razorpay.com/v1/checkout.js', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `
        window.Razorpay = function (options) {
          this.open = async function () {
            const paymentId = 'pay_autotest' + Date.now();
            const signature = await window.signPayment(options.order_id, paymentId);
            options.handler({
              razorpay_payment_id: paymentId,
              razorpay_order_id: options.order_id,
              razorpay_signature: signature,
            });
          };
        };`,
    })
  );
}