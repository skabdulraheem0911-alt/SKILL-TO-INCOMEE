import React, { useState } from 'react';
import { Binary, ShieldCheck, Search, CheckCircle2, Lock, AlertCircle, Sparkles, X, ShieldAlert } from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface CredentialLedgerViewProps {
  language: Language;
}

export const CredentialLedgerView: React.FC<CredentialLedgerViewProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [hashInput, setHashInput] = useState('8f4b23c91d4e7a60b93e817a3a2d10e5f29c48b1d927a4e69b031c5d8e72f910');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const performVerification = async (hashToVerify: string) => {
    if (!hashToVerify.trim()) return;
    setLoading(true);
    try {
      const res = await api.verifyCredential(hashToVerify.trim());
      setVerificationResult(res);
    } catch (e) {
      setVerificationResult({ valid: false, detail: "Network or cryptographic parsing error." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(hashInput);
  };

  const loadAuthenticDemo = () => {
    const validHash = '8f4b23c91d4e7a60b93e817a3a2d10e5f29c48b1d927a4e69b031c5d8e72f910';
    setHashInput(validHash);
    performVerification(validHash);
  };

  const loadTamperedDemo = () => {
    const tamperedHash = '999923c91d4e7a60b93e817a3a2d10e5f29c48b1d927a4e69b031c5d8e72f111';
    setHashInput(tamperedHash);
    performVerification(tamperedHash);
  };

  const handleClear = () => {
    setHashInput('');
    setVerificationResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
          SIH Differentiator 6 • Trust & Anti-Fraud Architecture
        </div>
        <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
          {t.nav_credential_ledger}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
          Cryptographic SHA-256 hash-anchored ledger allowing employers to instantly verify student course completions without relying on screenshots or forged PDFs.
        </p>
      </div>

      {/* Verification Query Bar */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Paste SHA-256 Certificate Hash..."
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem 1rem 0.65rem 2.5rem',
                  color: '#f8fafc',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button type="submit" disabled={loading || !hashInput.trim()} className="btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
              <ShieldCheck size={16} /> {loading ? 'Verifying...' : 'Validate Ledger Hash'}
            </button>

            {hashInput && (
              <button
                type="button"
                onClick={handleClear}
                className="btn-secondary"
                style={{ padding: '0.65rem 1rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Demo Pre-load Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={13} color="#38bdf8" /> Try Instant Demo Scenarios:
            </span>
            <button
              type="button"
              onClick={loadAuthenticDemo}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              <CheckCircle2 size={13} /> Test Authentic Credential
            </button>
            <button
              type="button"
              onClick={loadTamperedDemo}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem', color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              <ShieldAlert size={13} /> Test Tampered / Forged Hash
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result Display */}
      {verificationResult && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {verificationResult.valid ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#34d399' }}>
                <CheckCircle2 size={24} />
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                  Cryptographically Authentic & Verified On-Chain
                </h3>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Student Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {verificationResult.record.student_name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Accredited Program</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>
                    {verificationResult.record.course}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Issuing Authority</div>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {verificationResult.record.issued_by}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Anchor Date</div>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                    {verificationResult.record.date}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                Ledger Root: 0x9a8f...e102 • Hash: {hashInput}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171' }}>
              <AlertCircle size={24} />
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Certificate Hash Unverified</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  {verificationResult.detail}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
