# Contact Form Setup

The contact form posts to `/api/contact` and stays on the page. The API sends each message to Sunil's Gmail and WhatsApp without putting the WhatsApp number or provider credentials in browser code.

## Hosting

Deploy the `template` directory as the Vercel project root so `api/contact.js` is deployed as a Vercel Function alongside the static pages. A static-only host such as GitHub Pages cannot run this API; use Vercel or another host with server-side functions.

## Email

Create a Resend account, verify a sending domain, and create an API key. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in the Vercel project environment variables. The destination is `sunildhakadsd27@gmail.com`.

## WhatsApp

Set up a Meta WhatsApp Business Cloud API app and configure an approved message template named `portfolio_contact_notification` with four body variables in this order: sender name, sender email, subject, message. Set the access token, phone number ID, recipient number, template name, and template language as Vercel environment variables. The recipient number is kept server-side. The WhatsApp destination must be opted in to receive notifications from the Business account.

## Environment Variables

Copy the variable names from `.env.example` into Vercel Project Settings > Environment Variables. Set `PUBLIC_SITE_ORIGIN` to the exact deployed site origin, for example `https://portfolio.example.com` (no trailing slash). Never commit real API keys or tokens.

After adding or changing environment variables, redeploy the Vercel project. Test by submitting the form and confirm the Gmail and WhatsApp notifications arrive.