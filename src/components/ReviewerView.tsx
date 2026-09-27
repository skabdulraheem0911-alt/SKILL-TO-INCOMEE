import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Building, MessageSquare } from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ReviewerViewProps {
  currentRole: string;
  language: Language;
}

export const ReviewerView: React.FC<ReviewerViewProps> = ({
  currentRole,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activeComment, setActiveComment] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  useEffect(() => {
    loadSubmissions();
  }, [currentRole]);

  const loadSubmissions = async () => {
    try {
      const data = await api.getReviewerSubmissions(currentRole);
      setSubmissions(data);
    } catch (e: any) {
      console.error(e);
      setNotice({ type: 'error', message: e.message || 'Error loading reviewer submissions' });
    }
  };

  const handleAction = async (id: string, action: 'Approved' | 'Rejected') => {
    setLoading(true);
    const comment = activeComment[id] || `Evaluation by ${currentRole.toUpperCase()}: Standards criteria verified.`;
    try {
      await api.actionReviewerSubmission(id, action, comment, currentRole);
      setNotice({
        type: 'success',
        message: `Curriculum submission '${id}' has been marked as ${action.toUpperCase()}!`
      });
      setTimeout(() => setNotice(null), 5000);
      loadSubmissions();
    } catch (err: any) {
      setNotice({ type: 'error', message: err.message || 'Error processing review action' });
      setTimeout(() => setNotice(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = statusFilter === 'All'
    ? submissions
    : submissions.filter(s => s.status === statusFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c084fc', fontWeight: 700, letterSpacing: '0.05em' }}>
            Quality Governance (Section 4)
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
            {t.role_reviewer} Console
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Official state review queue for university curriculum updates and industry alignment submissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={statusFilter === tab ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            >
              {tab}
            </button>
          ))}
          <button
            onClick={loadSubmissions}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {notice && (
        <div style={{
          background: notice.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: notice.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          padding: '0.85rem 1.25rem',
          borderRadius: '8px',
          color: notice.type === 'success' ? '#6ee7b7' : '#fda4af',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{notice.message}</span>
          <button
            onClick={() => setNotice(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredSubmissions.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No curriculum submissions found for filter '{statusFilter}'.
          </div>
        ) : (
          filteredSubmissions.map((sub, idx) => {
          const isPending = sub.status === 'Pending' || sub.status === 'Under Review';
          const isApproved = sub.status === 'Approved';

          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.75rem', borderLeft: isApproved ? '4px solid #10b981' : (isPending ? '4px solid #f59e0b' : '4px solid #ef4444') }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {sub.id}</span>
                    <span className={`badge ${isApproved ? 'badge-low' : (isPending ? 'badge-medium' : 'badge-high')}`}>
                      {sub.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: 0 }}>
                    {sub.proposed_title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '0.25rem' }}>
                    {sub.institute} • {sub.department}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Industry Partner: <strong style={{ color: '#f8fafc' }}>{sub.industry_partner}</strong>
                </div>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.25rem', fontWeight: 600 }}>
                  Industrial Demand Justification:
                </div>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                  {sub.justification}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                  {sub.skills_covered?.map((s: string, sIdx: number) => (
                    <span key={sIdx} className="badge badge-demo" style={{ fontSize: '0.7rem' }}>
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Review Audit Comments */}
              {sub.comments?.length > 0 && (
                <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#a5b4fc', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {sub.comments.map((c: string, cIdx: number) => (
                    <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MessageSquare size={13} /> {c}
                    </div>
                  ))}
                </div>
              )}

              {/* Reviewer Action Bar */}
              {isPending && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Enter review comments or accreditation notes..."
                    value={activeComment[sub.id] || ''}
                    onChange={(e) => setActiveComment({ ...activeComment, [sub.id]: e.target.value })}
                    style={{
                      flex: 1,
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      color: '#f8fafc',
                      fontSize: '0.82rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleAction(sub.id, 'Approved')}
                    disabled={loading}
                    className="btn-primary"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)', fontSize: '0.82rem', padding: '0.55rem 1rem' }}
                  >
                    <CheckCircle2 size={15} /> Approve Curriculum
                  </button>
                  <button
                    onClick={() => handleAction(sub.id, 'Rejected')}
                    disabled={loading}
                    className="btn-secondary"
                    style={{ color: '#fda4af', borderColor: 'rgba(244, 63, 94, 0.3)', fontSize: '0.82rem', padding: '0.55rem 1rem' }}
                  >
                    <XCircle size={15} /> Reject / Revisions
                  </button>
                </div>
              )}
            </div>
          );
        }))}
      </div>
    </div>
  );
};
