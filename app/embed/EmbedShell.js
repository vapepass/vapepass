'use client';

import { useEffect } from 'react';

/**
 * Transparent chrome for the merchant iframe so only the chat FAB/panel is visible.
 */
export default function EmbedShell({ children }) {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.background;
    const prevBodyBg = body.style.background;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyMargin = body.style.margin;

    html.style.background = 'transparent';
    body.style.background = 'transparent';
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.margin = '0';

    return () => {
      html.style.background = prevHtmlBg;
      body.style.background = prevBodyBg;
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.margin = prevBodyMargin;
    };
  }, []);

  return (
    <div className="vapepass-embed-root relative h-[100dvh] w-full overflow-hidden bg-transparent">
      {children}
    </div>
  );
}
