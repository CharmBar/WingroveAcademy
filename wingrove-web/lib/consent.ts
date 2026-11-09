/** Cookie consent for Wingrove, mirroring the ElevateED site (Google Consent Mode v2). */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NDQQWLPC'

export const CONSENT_KEY = 'wingrove-consent' // localStorage: 'granted' | 'denied'
export const OPEN_PREFS_EVENT = 'wingrove:open-cookie-prefs'

/** Regions where analytics/ad cookies stay off until the visitor opts in (EEA, UK, Switzerland). */
const OPT_IN_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
  'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
]

/**
 * Google Consent Mode v2 defaults. Runs before Google Tag Manager loads.
 * - Opt-in regions: analytics and ads off until accepted.
 * - Elsewhere: analytics on, ads off; visitors can decline in the banner.
 * - A saved choice from a previous visit is applied straight away.
 */
export const consentDefaultsScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(OPT_IN_REGIONS)}});
gtag('set','ads_data_redaction',true);
gtag('js', new Date());
try{var c=localStorage.getItem('${CONSENT_KEY}');if(c==='granted'){gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}else if(c==='denied'){gtag('consent','update',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}}catch(e){}
`

export function setConsent(choice: 'granted' | 'denied') {
  try {
    localStorage.setItem(CONSENT_KEY, choice)
  } catch {}
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] }
  const v = choice
  w.gtag?.('consent', 'update', { analytics_storage: v, ad_storage: v, ad_user_data: v, ad_personalization: v })
  w.dataLayer?.push({ event: 'consent_update', consent_choice: choice })
}
