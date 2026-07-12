import { NextResponse } from 'next/server';

/**
 * Vercel Cron entrypoint — proxies to the backend daily inventory sync.
 * Configure CRON_SECRET and NEXT_PUBLIC_API_URL (or API_URL) in Vercel env.
 */
export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ success: false, message: 'Cron not configured' }, { status: 503 });
  }

  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when CRON_SECRET is set
  const provided = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (provided !== cronSecret) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const apiBase = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .replace(/\/+$/, '');

  try {
    const response = await fetch(`${apiBase}/cron/sync-inventory`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[cron] Failed to reach backend inventory sync:', error.message);
    return NextResponse.json(
      { success: false, message: 'Failed to reach inventory sync service' },
      { status: 502 }
    );
  }
}

export const dynamic = 'force-dynamic';
