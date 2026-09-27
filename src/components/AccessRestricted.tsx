import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

interface AccessRestrictedProps {
  currentRole: string;
  requiredRoleOrPermission: string;
  onReturn: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  currentRole,
  requiredRoleOrPermission,
  onReturn
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      textAlign: 'center',
      minHeight: '60vh'
    }}>
      <div style={{
        background: 'rgba(244, 63, 94, 0.1)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: '50%',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        color: '#f43f5e'
      }}>
        <Lock size={48} />
      </div>

      <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', color: '#f8fafc' }}>
        Access Restricted
      </h2>

      <p style={{ maxWidth: '520px', color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Your current active role <strong style={{ color: '#fb7185' }}>{currentRole}</strong> does not possess the required authorization: <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{requiredRoleOrPermission}</code>.
      </p>

      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: '#cbd5e1'
      }}>
        <ShieldAlert size={20} color="#f59e0b" />
        <span>Judges: Use the <strong>Demo Role Switcher</strong> at the top right to switch to an authorized role.</span>
      </div>

      <button onClick={onReturn} className="btn-primary">
        <ArrowLeft size={16} /> Return to Allowed Dashboard
      </button>
    </div>
  );
};
