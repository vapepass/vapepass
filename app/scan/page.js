'use client';
import { useCallback, useRef, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Progress from '@/components/ui/Progress';
import QrScanner from '@/components/QrScanner';
import { useToast } from '@/components/ui/Toast';
import { generateVerificationCode } from '@/lib/verification-api';
import { lookupCustomer, addStamp, redeemReward } from '@/lib/customer-api';
import { mapCustomer } from '@/lib/mappers';
import { ApiError } from '@/lib/api';
import { ScanLine, CheckCircle, Plus, RotateCcw, KeyRound, Copy } from 'lucide-react';

export default function Scan() {
  const { toast } = useToast();
  const [result, setResult] = useState(null);
  const [stamps, setStamps] = useState(null);
  const [codeData, setCodeData] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const processingScanRef = useRef(false);

  const handleScan = useCallback(async (decodedText) => {
    if (result || actionLoading || processingScanRef.current) return;

    processingScanRef.current = true;
    setCameraActive(false);

    // Wait for serialized camera stop (see QrScanner queue) before API call
    await new Promise((resolve) => setTimeout(resolve, 400));

    try {
      const customer = await lookupCustomer(decodedText);
      const mapped = mapCustomer(customer);
      setResult(mapped);
      setStamps(mapped.stamps);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Customer not found', 'error');
      setCameraActive(true);
    } finally {
      processingScanRef.current = false;
    }
  }, [result, actionLoading, toast]);

  const generateCode = async () => {
    setGeneratingCode(true);
    try {
      const data = await generateVerificationCode();
      setCodeData(data);
      toast('Age verification code generated', 'success');
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Failed to generate code', 'error');
    } finally {
      setGeneratingCode(false);
    }
  };

  const copyCode = () => {
    if (codeData?.code) {
      navigator.clipboard.writeText(codeData.code);
      toast('Code copied to clipboard', 'info');
    }
  };

  const handleAddStamp = async () => {
    if (!result || stamps >= result.goal) return;
    setActionLoading(true);
    try {
      const customer = await addStamp(result.id);
      const mapped = mapCustomer(customer);
      setResult(mapped);
      setStamps(mapped.stamps);
      const msg = mapped.stamps >= mapped.goal
        ? `Reward earned! ${mapped.name} gets a free reward.`
        : `Stamp added — ${mapped.stamps}/${mapped.goal}`;
      toast(msg, mapped.stamps >= mapped.goal ? 'success' : 'info');
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Failed to add stamp', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!result) return;
    setActionLoading(true);
    try {
      const customer = await redeemReward(result.id);
      const mapped = mapCustomer(customer);
      setResult(mapped);
      setStamps(0);
      toast('Reward redeemed — stamps reset', 'success');
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Failed to redeem reward', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setStamps(null);
    setCameraError('');
    setCameraActive(true);
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Scan Customer"
        description="Scan the customer's QR code at checkout"
      />

      <div className="max-w-md mx-auto space-y-6">
        {!result && (
          <Card>
            <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <KeyRound size={16} /> Age Verification Code
            </h3>
            <p className="text-sm text-body mb-4">
              Verify the customer&apos;s ID, then generate a one-time code (expires in 10 minutes).
            </p>
            {codeData ? (
              <div className="rounded-xl bg-brand-50 border border-brand-100 p-4 mb-4 text-center">
                <p className="text-xs text-muted mb-1">Give this code to the customer</p>
                <p className="text-3xl font-mono font-bold tracking-[0.3em] text-brand-700">{codeData.code}</p>
                <p className="text-xs text-muted mt-2">Expires in 10 minutes</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={copyCode}>
                  <Copy size={14} /> Copy Code
                </Button>
              </div>
            ) : null}
            <Button onClick={generateCode} disabled={generatingCode} variant="secondary" className="w-full mb-6">
              {generatingCode ? 'Generating…' : 'Generate Verification Code'}
            </Button>
          </Card>
        )}

        <Card className={result ? 'hidden' : ''}>
            {cameraError ? (
              <div className="rounded-2xl bg-canvas border border-line p-8 text-center mb-6">
                <p className="text-sm text-body mb-4">{cameraError}</p>
                <p className="text-xs text-muted">Use manual entry below or allow camera access.</p>
              </div>
            ) : (
              <div className="mb-6">
                <QrScanner
                  active={cameraActive && !result}
                  onScan={handleScan}
                  onError={(msg) => setCameraError(msg)}
                />
              </div>
            )}

            <ol className="space-y-3 mb-6" aria-label="Scan instructions">
              {[
                'Customer opens their member QR on their phone',
                'QR code is ready to scan at checkout',
                'Point device camera at QR code',
                'System identifies customer automatically',
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-body">
                  <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>

            <ManualLookup
              onFound={(c) => {
                setCameraActive(false);
                setResult(c);
                setStamps(c.stamps);
              }}
            />
          </Card>

        {result ? (
          <div className="animate-slide-up space-y-4">
            <Card>
              <div className="flex items-center gap-4 mb-5">
                <Avatar name={result.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink tracking-tight">{result.name}</p>
                  <p className="text-body text-sm">{result.phone}</p>
                </div>
                <Badge variant="success">
                  <CheckCircle size={11} className="mr-1" /> Verified
                </Badge>
              </div>

              <Progress value={stamps} max={result.goal} showLabel className="mb-5" />

              {stamps >= result.goal && (
                <p className="text-sm mb-4 font-medium text-warning-600">
                  Reward ready! Issue free reward, then tap Redeem.
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-6" aria-label={`${stamps} of ${result.goal} stamps`}>
                {Array.from({ length: result.goal }, (_, i) => (
                  <div
                    key={i}
                    className={[
                      'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
                      i < stamps ? 'bg-brand-600 scale-100' : 'bg-line-subtle scale-95',
                    ].join(' ')}
                  >
                    {i < stamps && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                        <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={handleAddStamp}
                disabled={actionLoading || stamps >= result.goal}
                className="w-full mb-3"
              >
                <Plus size={16} /> {actionLoading ? 'Adding…' : 'Add Stamp'}
              </Button>

              {stamps >= result.goal && (
                <Button onClick={handleRedeem} disabled={actionLoading} variant="secondary" className="w-full">
                  Redeem Reward
                </Button>
              )}
            </Card>

            <Button onClick={reset} variant="secondary" className="w-full">
              <RotateCcw size={15} /> Scan Another Customer
            </Button>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

function ManualLookup({ onFound }) {
  const [passId, setPassId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const lookup = async () => {
    if (!passId.trim()) return;
    setLoading(true);
    try {
      const customer = await lookupCustomer(passId.trim());
      onFound(mapCustomer(customer));
    } catch (err) {
      toast(err instanceof ApiError ? err.message : 'Customer not found', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-line pt-5">
      <p className="text-xs text-muted mb-2">Manual QR / member ID lookup</p>
      <div className="flex gap-2">
        <input
          className="flex-1 h-11 px-3 text-sm border border-line rounded-xl"
          placeholder="vapepass:uuid or paste QR value"
          value={passId}
          onChange={(e) => setPassId(e.target.value)}
        />
        <Button onClick={lookup} disabled={loading} size="sm">
          <ScanLine size={14} /> {loading ? '…' : 'Lookup'}
        </Button>
      </div>
    </div>
  );
}
