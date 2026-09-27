import React, { useState, useEffect } from 'react';
import { GraduationCap, TrendingUp, AlertTriangle, Send, CheckCircle2, BarChart2 } from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface InstituteViewProps {
  currentRole: string;
  language: Language;
}

export const InstituteView: React.FC<InstituteViewProps> = ({
  currentRole,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [analytics, setAnalytics] = useState<any>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [proposedTitle, setProposedTitle] = useState('');
  const [skillsCovered, setSkillsCovered] = useState('AWS, Docker, FastAPI');
  const [industryPartner, setIndustryPartner] = useState('Persistent Systems');
  const [justification, setJustification] = useState('Addresses severe 59% gap in Cloud Engineering in Pune Hinjewadi IT zone.');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    api.getInstituteAnalytics(currentRole)
      .then(setAnalytics)
      .catch(console.error);
  }, [currentRole]);

  const handleSubmitCurriculum = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await api.submitCurriculum({
        institute: analytics?.institution || "COEP Technological University, Pune",
        department: "Computer Engineering",
        proposed_title: proposedTitle,
        skills_covered: skillsCovered.split(',').map(s => s.trim().toLowerCase()),
        industry_partner: industryPartner,
        justification: justification
      }, currentRole);

      setShowSubmitModal(false);
      setProposedTitle('');
      setSubmittedMessage("Curriculum successfully submitted to Skill Authority Reviewer queue!");
      setTimeout(() => setSubmittedMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting curriculum');
      setTimeout(() => setErrorMessage(null), 6000);
    }
  };

  if (!analytics) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Loading institutional alignment analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>
            Academic Alignment Console (Module K)
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
            {analytics.institution}
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Department: <strong style={{ color: '#f8fafc' }}>{analytics.department}</strong> • Enrolled: {analytics.enrolled_students} Students • Aggregate Placement Readiness: <strong style={{ color: '#34d399' }}>{analytics.placement_readiness_rate}</strong>
          </div>
        </div>

        <button onClick={() => setShowSubmitModal(true)} className="btn-primary">
          <Send size={16} /> Submit Curriculum for Authority Approval
        </button>
      </div>

      {submittedMessage && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {submittedMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '1rem', borderRadius: '8px', color: '#fda4af', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} /> {errorMessage}
        </div>
      )}

      {/* Aggregate Department Skill Distribution vs Industry Demand (Side-by-Side as required in Section 16) */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} color="#06b6d4" /> Department Coverage vs Industry Demand Benchmark
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Side-by-side gap visualization exposing mismatches between classroom syllabus and Maharashtra employer demand.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Technical Domain / Skill</th>
                <th style={{ padding: '0.75rem 1rem' }}>College Coverage %</th>
                <th style={{ padding: '0.75rem 1rem' }}>Maharashtra Industry Demand %</th>
                <th style={{ padding: '0.75rem 1rem' }}>Curriculum Gap</th>
                <th style={{ padding: '0.75rem 1rem' }}>Urgency Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.skills_comparison?.map((row: any, idx: number) => {
                const isSevere = row.status === 'Severe Gap';
                const isCritical = row.status === 'Critical Gap';

                return (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#f8fafc' }}>
                      {row.skill}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.curriculum_coverage_pct}%`, height: '100%', background: '#6366f1' }} />
                        </div>
                        <span>{row.curriculum_coverage_pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${row.industry_demand_pct}%`, height: '100%', background: '#06b6d4' }} />
                        </div>
                        <span style={{ color: '#38bdf8', fontWeight: 600 }}>{row.industry_demand_pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: isSevere || isCritical ? '#f87171' : '#fcd34d', fontWeight: 700 }}>
                      {row.gap_pct}%
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={isSevere ? 'badge badge-high' : (isCritical ? 'badge badge-medium' : 'badge badge-low')}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Curriculum Submission Modal */}
      {showSubmitModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1.25rem' }}>
              Submit Curriculum Update for Review
            </h3>
            <form onSubmit={handleSubmitCurriculum} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Proposed Elective Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud-Native Microservices & Docker"
                  value={proposedTitle}
                  onChange={(e) => setProposedTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Skills Covered (comma separated)</label>
                <input
                  type="text"
                  required
                  value={skillsCovered}
                  onChange={(e) => setSkillsCovered(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Industry Partner / Validator</label>
                <input
                  type="text"
                  required
                  value={industryPartner}
                  onChange={(e) => setIndustryPartner(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Industrial Gap Justification</label>
                <textarea
                  rows={3}
                  required
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Submit to Authority Reviewer
                </button>
                <button type="button" onClick={() => setShowSubmitModal(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
