'use client';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, FormField } from '@/components/ui/Input';
import StoreBrandPreview from '@/components/StoreBrandPreview';
import QrCodeImage from '@/components/QrCodeImage';
import { Save, CheckCircle, Link2, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import { formToStorePayload, storeToForm } from '@/lib/store-utils';
import { ApiError, fieldErrorsToMap } from '@/lib/api';

const COLORS = ['#7c3aed', '#db2777', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#9333ea', '#0891b2'];
const STAMP_GOALS = [5, 7, 8, 9, 10, 12, 15];

export default function Programs() {
  const { toast } = useToast();
  const { store, updateStore } = useAuth();
  const [form, setForm] = useState(storeToForm(null));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    if (store) setForm(storeToForm(store));
  }, [store]);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  const joinUrl = store?._id
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/join-program?store=${store._id}`
    : '';

  const copyJoinLink = () => {
    if (joinUrl) {
      navigator.clipboard.writeText(joinUrl);
      toast('Join link copied', 'success');
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateStore(formToStorePayload(form), logoFile);
      setLogoFile(null);
      setSaved(true);
      toast('Program settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      const message = err instanceof ApiError
        ? fieldErrorsToMap(err.errors).name || err.message
        : 'Failed to save program settings';
      toast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Rewards Programs"
        description="Configure visit goals and rewards for new customers"
      />

      {joinUrl && (
        <Card className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <QrCodeImage value={joinUrl} size={160} alt="Store join QR code" />
              <p className="text-xs text-muted text-center mt-2">Print & display at checkout</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink flex items-center gap-2">
                <Link2 size={16} /> Customer join link & QR
              </p>
              <p className="text-xs text-body mt-2 break-all">{joinUrl}</p>
              <p className="text-xs text-muted mt-2">
                Customers scan this QR in-store, enter their age verification code, and join your rewards program.
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={copyJoinLink}>
                <Copy size={14} /> Copy Link
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Card className="space-y-6">
          <FormField label="Store Name" htmlFor="store-name">
            <Input id="store-name" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Cloud Nine Vapes" />
          </FormField>

          <div>
            <label className="block text-sm font-medium text-ink mb-2">Logo</label>
            <div className="flex items-center gap-4">
              {form.logo ? (
                <img src={form.logo} alt="" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
              ) : (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-sm"
                  style={{ background: form.color }}
                >
                  {form.name.charAt(0) || '?'}
                </div>
              )}
              <label className="cursor-pointer">
                <Button variant="secondary" size="sm" as="span">Upload Logo</Button>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  aria-label="Upload store logo"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setLogoFile(file);
                  }}
                />
              </label>
              {logoFile && <span className="text-xs text-muted">{logoFile.name}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-3">Brand Color</label>
            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Brand color">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={form.color === c}
                  onClick={() => set('color', c)}
                  className={[
                    'w-9 h-9 rounded-xl transition-all min-h-[44px] min-w-[44px]',
                    form.color === c ? 'ring-2 ring-ink ring-offset-2 scale-110' : 'hover:scale-105',
                  ].join(' ')}
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1">Stamp Goal</label>
            <p className="text-xs text-muted mb-3">Stamps needed to earn the reward</p>
            <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Stamp goal">
              {STAMP_GOALS.map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={form.stampGoal === n}
                  onClick={() => set('stampGoal', n)}
                  className={[
                    'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                    form.stampGoal === n
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-canvas text-body border border-line hover:border-[#d4d4dc]',
                  ].join(' ')}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <FormField label="Reward Description" htmlFor="reward">
            <Input id="reward" value={form.reward} onChange={(e) => set('reward', e.target.value)} placeholder="Free 30ml juice of your choice" />
          </FormField>

          <div className="px-4 py-3.5 rounded-xl text-sm bg-brand-50 text-brand-700 border border-brand-100">
            Every <strong>{form.stampGoal}th visit</strong> earns: <strong>{form.reward || '—'}</strong>
          </div>

          <Button onClick={save} className="w-full" disabled={saving}>
            {saving ? 'Saving…' : saved ? <><CheckCircle size={15} /> Saved</> : <><Save size={15} /> Save Changes</>}
          </Button>
        </Card>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-4">Live Brand Preview</p>
          <StoreBrandPreview
            store={{
              name: form.name,
              color: form.color,
              stampGoal: form.stampGoal,
              reward: form.reward,
              stamps: 4,
              customerName: 'Alex Johnson',
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
