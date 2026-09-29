# Stripe Integration Setup & Placeholders Checklist

This document tracks all sample placeholders and remaining steps needed to finalize the Stripe Checkout integration.

## 1. Sample Placeholders in `/create-checkout-session`

The endpoint at `/create-checkout-session` (and `/api/create-checkout-session`) currently contains the following sample placeholders:

| Parameter | Current Value | Required Action |
| :--- | :--- | :--- |
| `success_url` | `'{{SUCCESS_URL}}'` | Replace with your actual frontend post-payment return URL, e.g. `https://yourdomain.com/?session_id={CHECKOUT_SESSION_ID}&payment_status=success` or read dynamically from request body / origin header. |
| `cancel_url` | `'{{CANCEL_URL}}'` | Replace with your actual cancellation return URL, e.g. `https://yourdomain.com/?payment_status=cancelled` or read dynamically from request body / origin header. |
| `line_items[0].price_data.currency` | `''` | Provide a valid ISO 3-letter currency code (e.g. `'usd'`, `'zar'`, `'eur'`). Empty string will be rejected by Stripe API at runtime. |
| `line_items[0].price_data.product_data.name` | `'{{PRODUCT_NAME}}'` | Replace with the actual product or subscription name (e.g. `Adaptive Liquidity Pro V1.0`, `School of AI Trading Architecture`). |
| `line_items[0].price_data.unit_amount` | `2000` | Adjust the amount to match your pricing in the smallest currency unit (e.g., 2000 cents = $20.00 USD). |
| `mode` | `'payment'` | Keep `'payment'` for one-time payments, or set to `'subscription'` if billing recurring plans. |

## 2. Environment Variables & Keys

- **Secret Key**: Add your live or test secret key to your `.env` file or hosting environment:
  ```env
  STRIPE_SECRET_KEY=sk_test_... # or sk_live_...
  ```
- Best practice: Never commit live Stripe secret keys to version control.

## 3. Fixed UI Parameters (Configured)

The following parameters have been configured according to the Stripe Checkout UI configuration:
- `ui_mode`: `'hosted_page'`
- `billing_address_collection`: `'auto'`
- `name_collection`: `{ individual: { enabled: true, optional: true } }`
- `phone_number_collection`: `{ enabled: true }`
- `allow_promotion_codes`: `true`
- `consent_collection`: `{ terms_of_service: 'required' }`
- `submit_type`: `'auto'`
- `integration_identifier`: `'hosted_mobile_app_0001'`
- `origin_context`: `'mobile_app'`

## 4. Next Steps for Production

1. **Dynamic Payload**: Allow the endpoint to accept request body parameters (`productId`, `customerEmail`, `tierName`, etc.) to dynamically construct line items and URLs matching the catalog.
2. **Webhooks**: Implement a webhook endpoint (`/api/webhooks/stripe`) verifying Stripe signatures and handling `checkout.session.completed` events for automated license generation and database persistence.
3. **Domain Verification**: In your Stripe Dashboard, register your production domain under **Apple Pay & Google Pay** and configure your business branding.
