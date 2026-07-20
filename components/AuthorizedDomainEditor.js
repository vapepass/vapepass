'use client';

import { useEffect, useState } from 'react';
import { Globe2, Pencil, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { updateStoreSettings } from '@/lib/store-api';
import { ApiError } from '@/lib/api';

/**
 * Single active authorized embed domain editor.
 * Security still validates embeds against this one hostname only.
 */
export default function AuthorizedDomainEditor({
  allowedHostname = null,
  websiteUrl = null,
  onSaved,
  compact = false,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const active = allowedHostname || null;
  const websiteHostHint = websiteUrl || null;

  useEffect(() => {
    if (!editing) {
      setDraft(active || websiteHostHint || '');
    }
  }, [active, websiteHostHint, editing]);

  const startEdit = () => {
    setError('');
    setSuccess('');
    setDraft(active || websiteHostHint || '');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
    setDraft(active || websiteHostHint || '');
  };

  const save = async () => {
    const value = draft.trim();
    if (!value) {
      setError('Enter a domain or URL');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const store = await updateStoreSettings({ allowedHostname: value });
      setEditing(false);
      setSuccess('Authorized domain updated');
      setTimeout(() => setSuccess(''), 2500);
      onSaved?.(store);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to update authorized domain');
    } finally {
      setSaving(false);
    }
  };

  const resetToWebsite = async () => {
    if (!websiteHostHint) {
      setError('No store website URL is set yet');
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const store = await updateStoreSettings({ allowedHostname: websiteHostHint });
      setEditing(false);
      setSuccess('Reset to store website domain');
      setTimeout(() => setSuccess(''), 2500);
      onSaved?.(store);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to reset authorized domain');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={
        compact
          ? 'rounded-xl border border-line bg-canvas/60 px-4 py-3 space-y-3'
          : 'rounded-xl border border-line bg-canvas px-4 py-4 space-y-3'
      }
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Globe2 size={16} className="text-brand-600" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Authorized domain</p>
          <p className="text-xs text-muted mt-0.5 leading-relaxed">
            The embed script only works on this one domain. Change it for local, staging, or
            production testing — the previous domain is replaced immediately.
          </p>
        </div>
      </div>

      {!editing ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <p className="text-sm font-medium text-ink break-all font-mono bg-surface border border-line rounded-lg px-3 py-2">
            {active || 'Not set — save a store website URL first'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={startEdit} disabled={!active && !websiteHostHint}>
              <Pencil size={14} /> Change
            </Button>
            {websiteHostHint && active && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToWebsite}
                disabled={saving}
                title="Use the store website domain again"
              >
                <RotateCcw size={14} /> Reset to website
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://localhost:3000 or staging.example.com"
            disabled={saving}
            autoFocus
            aria-label="Authorized domain"
          />
          <p className="text-[11px] text-muted">
            Examples: http://localhost:3000 · http://127.0.0.1:5500 · https://my-app.vercel.app ·
            https://johnstore.com
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={save} disabled={saving || !draft.trim()}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
            <Button variant="secondary" size="sm" onClick={cancelEdit} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-danger-600 bg-danger-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="text-xs text-success-600 bg-success-50 border border-green-200 rounded-lg px-3 py-2">
          {success}
        </p>
      )}
    </div>
  );
}
