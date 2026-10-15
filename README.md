# Khumbu Nuru lodge landing page

Next.js App Router landing page and Thank You page using TypeScript and Tailwind CSS 4. The opening hero is bilingual; remaining sections are in English.

## Local setup

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. For production:

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Import `mingma32/service-landing-page` into Vercel.
2. Select the Next.js framework preset and the repository root as Root Directory.
3. Use `npm install` and `npm run build`; leave Output Directory at its default.
4. Set `NEXT_PUBLIC_SITE_URL` to your final production URL.
5. Optionally set `NEXT_PUBLIC_VIMEO_ID` to the numeric ID from your real Vimeo URL. Autoplay is disabled.
6. Deploy. Future pushes to main can trigger automatic deployments when enabled in Vercel.

## Included

- `app/page.tsx`: landing page
- `app/thank-you/page.tsx`: demo acknowledgement, video placeholder or Vimeo player, WhatsApp button
- `app/layout.tsx`: SEO and Open Graph metadata
- `app/globals.css`: responsive styles and Tailwind setup
- `components/`: reusable header, hero, problem, benefits, process, form and CTA components
- `public/logo.png`: supplied company logo

## Form behavior

The form validates required fields, email, WhatsApp number and optional URL, then simulates submission and redirects to `/thank-you?demo=1`. No details are sent or saved. Both pages clearly explain the demo status. WhatsApp opens +91 7987638713 with an offer-specific message. The checklist is not generated or delivered by this code.

Before collecting real leads, connect a backend, validate server-side, add abuse protection, and redirect only after successful storage. Update the demo notices only after that integration works. Implement checklist delivery and demo scheduling before promising those actions occurred.

No urgency claims, stock images, testimonials or unsupported results are included.
