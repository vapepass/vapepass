'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';

// Serialize camera start/stop so play() is never interrupted by clear()/stop()
let cameraQueue = Promise.resolve();

function enqueueCameraTask(task) {
  cameraQueue = cameraQueue.then(task).catch(() => {});
  return cameraQueue;
}

function isIgnorableCameraError(err) {
  const message = err?.message || String(err);
  return (
    err?.name === 'AbortError' ||
    message.includes('play() request was interrupted') ||
    message.includes('The play() request was interrupted') ||
    message.includes('interrupted by a call to pause') ||
    message.includes('interrupted by a new load request') ||
    message.includes('scanner is not running or paused')
  );
}

async function safeStopScanner(scanner, startPromise) {
  if (!scanner) return;

  try {
    // Wait for html5-qrcode's internal play() to settle before stop/clear
    if (startPromise) {
      await startPromise.catch(() => {});
    }

    await new Promise((resolve) => setTimeout(resolve, 150));

    const state = scanner.getState();
    if (
      state === Html5QrcodeScannerState.SCANNING ||
      state === Html5QrcodeScannerState.PAUSED
    ) {
      await scanner.stop();
    }

    scanner.clear();
  } catch (err) {
    if (!isIgnorableCameraError(err)) {
      // Camera may already be released
    }
  }
}

export default function QrScanner({ onScan, onError, active = true }) {
  const [started, setStarted] = useState(false);
  const scannerRef = useRef(null);
  const startPromiseRef = useRef(null);
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const idRef = useRef(`qr-reader-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // html5-qrcode can reject play() internally when stop/clear races startup
  useEffect(() => {
    const onUnhandledRejection = (event) => {
      if (isIgnorableCameraError(event.reason)) {
        event.preventDefault();
      }
    };
    window.addEventListener('unhandledrejection', onUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', onUnhandledRejection);
  }, []);

  useEffect(() => {
    let disposed = false;

    enqueueCameraTask(async () => {
      const existing = scannerRef.current;
      const existingStart = startPromiseRef.current;
      scannerRef.current = null;
      startPromiseRef.current = null;

      if (existing) {
        await safeStopScanner(existing, existingStart);
        if (!disposed) setStarted(false);
      }

      if (!active || disposed) return;

      try {
        const scanner = new Html5Qrcode(idRef.current);
        scannerRef.current = scanner;

        const startPromise = scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decoded) => {
            onScanRef.current?.(decoded);
          },
          () => {}
        );
        startPromiseRef.current = startPromise;

        await startPromise;

        if (disposed || !active) {
          await safeStopScanner(scanner, startPromise);
          scannerRef.current = null;
          startPromiseRef.current = null;
          return;
        }

        setStarted(true);
      } catch (err) {
        scannerRef.current = null;
        startPromiseRef.current = null;
        if (!disposed && !isIgnorableCameraError(err)) {
          onErrorRef.current?.(err?.message || 'Unable to access camera');
        }
      }
    });

    return () => {
      disposed = true;
      const scanner = scannerRef.current;
      const startPromise = startPromiseRef.current;
      scannerRef.current = null;
      startPromiseRef.current = null;
      setStarted(false);

      enqueueCameraTask(async () => {
        await safeStopScanner(scanner, startPromise);
      });
    };
  }, [active]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-black aspect-square"
      style={active ? undefined : { visibility: 'hidden', position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden={!active}
    >
      {/* Keep container in the document — never unmount while camera may be starting */}
      <div id={idRef.current} className="w-full h-full [&>video]:object-cover" />
      {active && !started && (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas text-sm text-body">
          Starting camera…
        </div>
      )}
    </div>
  );
}
