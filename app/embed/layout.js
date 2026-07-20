import EmbedShell from './EmbedShell';

export const metadata = {
  title: 'VapePass Assistant',
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }) {
  return <EmbedShell>{children}</EmbedShell>;
}
