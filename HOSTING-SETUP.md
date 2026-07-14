# Quantum-hub host setup

## Meeting calendar

The site is prepared for an inline Calendly calendar. Calendly was selected because its current free plan supports one event type, one connected calendar and unlimited meetings; inline embeds are available on every plan. It also has substantially more verified review volume than the smaller free alternatives considered.

The account has to be created by the mailbox owner because Calendly requires email verification and access to the host's work calendar.

1. Create a free Calendly account with `intern@quantum-hub.com`.
2. In Calendly, open **Availability → Calendar settings → Connect calendar account** and connect the Google, Microsoft 365/Outlook, or Exchange calendar that should be checked for conflicts.
3. Create one 30-minute event type, set the available hours, buffers, location/video-call option, and booking questions.
4. Copy the public event URL, such as `https://calendly.com/your-account/30min`.
5. Paste that URL into `calendarUrl` in `js/site-config.js` and publish the change.

The host then manages availability, bookings, cancellations, and invitee details from the Calendly dashboard. New bookings are also placed on the connected work calendar and sent to the Calendly account email.

Until `calendarUrl` is configured, the contact page shows a working email fallback instead of a broken third-party widget.

## Website form notifications

The contact and SPARK registration forms post to FormSubmit's AJAX endpoint for `intern@quantum-hub.com`. FormSubmit does not require an account, but it does require one-time ownership confirmation:

1. Submit either website form once after publication.
2. Open the confirmation message sent by FormSubmit to `intern@quantum-hub.com`.
3. Approve the endpoint using the link in that email.
4. Submit the form again and confirm that the formatted notification arrives.

After confirmation, every SPARK registration includes the applicant's name, work email, company, product stage, privacy consent, and optional batch-update preference. Contact-form messages go to the same inbox. The site uses a honeypot field and FormSubmit's default CAPTCHA protections.

## Original-site media audit

Matched with original Quantum-hub media:

- Official Quantum-hub logo and the four current partner marks.
- The connected industrial playground illustration.
- The Quantum-hub event photograph.
- The original POC Playground vehicle still and video.
- The official SPARK mark.
- Corractions, Tactile Mobility, Maradin, Coreteel, and Actasys case-study marks.

Original media that could not be matched one-to-one:

- The old site did not provide a distinct usable photograph for each of the four industry sections. The redesign uses the closest original playground/event/POC asset and the relevant Coreteel mark instead of repeating or inventing sector photography.
- The old site exposed only one reusable current event photograph; no distinct, current news image was available for every news slot. Unsupported news placeholders were removed and replaced with verified LinkedIn-linked program updates.
- The Actasys page did not provide a separate downloadable test diagram or a published performance-result image. The page uses the official Actasys mark and the original playground still, and reports only the published test scope.
- Several image URLs on the old WordPress site returned HTTP 415 responses. None were used as broken placeholders.

Do not restore the superseded AI-style partner cards in `assets/partners/*.jpg` or the very large working files in `assets/Logos/`; the live pages now use the official optimized PNG marks.
