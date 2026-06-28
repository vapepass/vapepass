'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCodeImage({ value, size = 200, alt = 'QR code', className = '' }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!value) {
      setSrc('');
      return;
    }

    QRCode.toDataURL(value, { width: size, margin: 2, errorCorrectionLevel: 'M' })
      .then(setSrc)
      .catch(() => setSrc(''));
  }, [value, size]);

  if (!value) return null;

  if (!src) {
    return (
      <div
        className={`bg-canvas border border-line rounded-xl animate-pulse ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-xl border border-line bg-white ${className}`}
    />
  );
}
