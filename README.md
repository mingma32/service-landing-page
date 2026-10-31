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

## Flodesk signup

The page now uses the official Flodesk embed for form `6ae5c2b4753c3852487971f7` and loads `https://assets.flodesk.com/universal.js` once. `components/FlodeskForm.tsx` initializes the exact form ID provided by the owner. No API key is needed or exposed. Signup requests are handled by Flodesk, including its CSRF, validation, CAPTCHA, double opt-in and assigned segments.

The existing site card and two-column desktop / single-column mobile layout style the native Flodesk controls. The embed always loads the form's currently published fields. Finish mapping and saving any fields in Flodesk: unmapped draft fields cannot be collected by the website. Map Business Name and Website or Facebook URL as required fields, and Anything You Want to Say as optional. Email, Full Name and WhatsApp Number must remain present. Never hard-code Flodesk's obfuscated field names or CSRF values.

The old simulated redirect and all demo notices have been removed. A same-origin `/thank-you` redirect is performed only when Flodesk's native root enters its server-confirmed success stage after submission. Failed validation, network errors and CAPTCHA challenges do not trigger the site's success redirect. A short-lived session marker (timestamp only, no personal data) determines whether the Thank You page can show a received confirmation. Direct visits show neutral email instructions.

The form's Flodesk settings currently control double opt-in. Keep the workflow published and set its trigger to the segment assigned to this form. Website code cannot publish or inspect account-level workflows, assign unsaved draft fields, or verify actual email delivery. Existing subscribers may not re-enter a workflow, depending on Flodesk's settings. Test with an email address you control, complete opt-in, then check the subscriber record, segment and workflow activity in Flodesk.

In Flodesk, use a Thank You redirect of `https://service-landing-page-17fi.vercel.app/thank-you` without the old `?demo=1` query. The site's success-stage observer also keeps successful visitors on their current site's Thank You page.
