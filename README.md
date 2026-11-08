# Wingrove Academy website

Staging site for the new wingroveacademy.org, served at **wingroveacademy.ai** behind a preview password.
Built on the same platform as the ElevateED site (Next.js + Sanity + Vercel + HubSpot) but fully separate from it:

| | Wingrove | ElevateED (untouched) |
| --- | --- | --- |
| GitHub | `CharmBar/WingroveAcademy` | `CharmBar/ElevateED` |
| Sanity project | `lvh3kfks` (Wingrove Academy) | `g9vmcwkr` |
| Vercel project | `wingrove-academy` | ElevateED project |
| Domain | wingroveacademy.ai | elevateed.com |
| HubSpot | Wingrove's own account (env vars only) | ElevateED account 247877716 |
| Gate cookie | `wa_gate` | `ee_gate` |

The app lives in `wingrove-web/`. Embedded Sanity Studio at `/studio`.

## Run it locally

```bash
cd wingrove-web
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000 — Studio at /studio
```

Every field falls back to the approved copy and renderings in `lib/content.ts` and `public/media`,
so the site renders before anything is entered in Sanity. Published Sanity content replaces it field by field
(pages revalidate every 60 seconds).

## Environment variables (Vercel → wingrove-academy → Settings → Environment Variables)

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `lvh3kfks` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://wingroveacademy.ai` |
| `SITE_PASSWORD` | the preview password (replaces the starting one) |
| `SITE_GATE` | `on` now, `off` at launch |
| `NEXT_PUBLIC_ADOBE_FONTS_KIT` | Adobe Fonts web project ID for Kepler + Soleil (optional) |
| `HUBSPOT_PORTAL_ID`, `HUBSPOT_INSIDER_FORM_ID`, `HUBSPOT_REGION` | Wingrove's own HubSpot account and Become an Insider form |
| `RESEND_API_KEY`, `INSIDER_NOTIFY_TO`, `INSIDER_FROM` | optional email alert per sign-up |

## Become an Insider → HubSpot

`/api/insider` posts each sign-up to the HubSpot form named by `HUBSPOT_INSIDER_FORM_ID`.
There are deliberately no built-in IDs, so nothing can land in ElevateED's HubSpot.
Fields sent: `email`, `firstname`, `lastname`, and two custom contact properties to create in Wingrove's HubSpot:
`wingrove_role` (I am a…) and `inquiry_source` (`website_insider_signup`).
Until the IDs are set, visitors are told sign-ups open soon, so no sign-up is lost silently.

## Content access levels

Team members already carry a **Who can see this** field (Everyone / Insiders / Invited stakeholders) for the
Insider area and stakeholder portal still to come.
