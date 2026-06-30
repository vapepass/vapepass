import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'VapePass — Your AI Flavor Sommelier',
  description: 'Give every customer a personalized flavor recommendation the moment they walk in — compliant by design, powered by AI, and connected to your live inventory.',
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
