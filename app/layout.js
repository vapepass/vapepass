import './globals.css';
import Providers from '@/components/Providers';

const siteDescription =
  'A streamlined digital loyalty platform that replaces paper punch cards with seamless mobile wallet passes, helping local vape shops increase customer retention without the need for custom apps.';

const ogImage =
  'https://media.base44.com/images/public/6a25e6b857297b9d3cd8850c/12c120646_logo.png/v1/fill/w_1200,h_630/12c120646_logo.png';

export const metadata = {
  title: 'Vapepass',
  description: siteDescription,
  icons: {
    icon: 'https://media.base44.com/images/public/6a25e6b857297b9d3cd8850c/12c120646_logo.png',
  },
  openGraph: {
    title: 'Vapepass',
    description: siteDescription,
    url: 'https://uppish-vape-pass-flow.base44.app',
    siteName: 'Vapepass',
    images: [{ url: ogImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vapepass',
    description: siteDescription,
    images: [ogImage],
  },
  appleWebApp: {
    capable: true,
    title: 'Vapepass',
    statusBarStyle: 'black',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
