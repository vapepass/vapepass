import { NextResponse } from 'next/server';

/**
 * Vercel Cron — proxies to backend subscription renewal reminders + expiry.
 */
export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json({ success: false, message: 'Cron not configured' }, { status: 503 });
  }

  const provided = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (provided !== cronSecret) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const apiBase = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
    .replace(/\/+$/, '');

  try {
    const response = await fetch(`${apiBase}/cron/subscription-lifecycle`, {
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
    console.error('[cron] Failed to reach subscription lifecycle service:', error.message);
    return NextResponse.json(
      { success: false, message: 'Failed to reach subscription lifecycle service' },
      { status: 502 }
    );
  }
}

export const dynamic = 'force-dynamic';
