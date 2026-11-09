import Script from 'next/script'

/** Google Tag Manager container for Wingrove Academy. Override with NEXT_PUBLIC_GTM_ID; set it to "off" to disable. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NDQQWLPC'

export default function GoogleTag() {
  if (!GTM_ID || GTM_ID === 'off') return null
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
(function(d,s,i){var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(document,'script','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} title="Google Tag Manager" />
      </noscript>
    </>
  )
}
