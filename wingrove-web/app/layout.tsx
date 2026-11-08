import './globals.css'

const adobeKit = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-fonts={adobeKit ? 'adobe' : undefined}>
      <head>
        {adobeKit ? (
          // Brand faces (Kepler + Soleil) from Wingrove's Adobe Fonts web project
          <link rel="stylesheet" href={`https://use.typekit.net/${adobeKit}.css`} />
        ) : (
          <>
            {/* Stand-ins until the Adobe Fonts kit is set */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap"
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
