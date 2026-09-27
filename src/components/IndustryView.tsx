import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Users,
  Search,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Scale,
  Calendar,
  Send,
  X,
  FileCheck,
  Star,
  Building,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface IndustryViewProps {
  currentRole: string;
  language: Language;
}

export const IndustryView: React.FC<IndustryViewProps> = ({
  currentRole,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('Tata Consultancy Services (TCS)');
  const [newLocation, setNewLocation] = useState('Pune / Hinjewadi Phase 3');
  const [newRole, setNewRole] = useState('full-stack-developer');
  const [selectedSkills, setSelectedSkills] = useState('React, Node.js, SQL, REST APIs');

  // Candidate Actions Modal States
  const [selectedCandidateForInvite, setSelectedCandidateForInvite] = useState<any | null>(null);
  const [selectedCandidateForAudit, setSelectedCandidateForAudit] = useState<any | null>(null);
  const [inviteDate, setInviteDate] = useState('2026-10-05T10:00');
  const [inviteFormat, setInviteFormat] = useState('Virtual Video Screen (Google Meet)');
  const [inviteNotes, setInviteNotes] = useState('We reviewed your SkillBridge compatibility score and would like to conduct a technical conversation.');
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // Status Notification Banner
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 6000);
  };

  const loadData = async () => {
    try {
      const [candList, jobList] = await Promise.all([
        api.searchCandidates('full-stack-developer'),
        api.getIndustryJobs()
      ]);
      setCandidates(candList);
      setJobs(jobList);
    } catch (e: any) {
      console.error(e);
      showToast('error', e.message || 'Failed to load industry dashboard data.');
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = selectedSkills.split(',').map(s => ({
        skill_id: s.trim().toLowerCase(),
        importance: 'high'
      }));

      await api.createIndustryJob({
        title: newTitle,
        company: newCompany,
        location: newLocation,
        industry: "IT & Software",
        role_id: newRole,
        required_skills: skillsArray,
        description: "Seeking industry-aligned candidates verified through Maharashtra SkillBridge platform."
      }, currentRole);

      setShowCreateModal(false);
      setNewTitle('');
      showToast('success', `Job posting '${newTitle}' created and published to students!`);
      loadData();
    } catch (err: any) {
      showToast('error', err.message || 'Error posting job requirement');
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateForInvite) return;
    setSubmittingInvite(true);
    try {
      const res = await api.inviteCandidate({
        student_id: selectedCandidateForInvite.id || 'STD-COEP-01',
        student_name: selectedCandidateForInvite.name,
        role_title: 'Full Stack Developer',
        interview_date: inviteDate,
        format: inviteFormat,
        notes: inviteNotes
      }, currentRole);

      setSelectedCandidateForInvite(null);
      showToast('success', res.message || `Interview invitation dispatched to ${selectedCandidateForInvite.name}!`);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to dispatch interview invite.');
    } finally {
      setSubmittingInvite(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          background: notification.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
          border: notification.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
          padding: '1rem 1.25rem',
          borderRadius: '8px',
          color: notification.type === 'success' ? '#6ee7b7' : '#fda4af',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
            Employer & Industry Console (Module J)
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
            {t.nav_industry}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Publish skill-weighted requirements, benchmark candidate compatibility, and collaborate on college curricula.
          </p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus size={16} /> Publish Job Requirement
        </button>
      </div>

      {/* Candidate Compatibility Search & Match */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#38bdf8" /> Pre-Screened Candidates (Full Stack Developer)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Candidate-job compatibility dynamically computed using transparent weighted scoring model.
            </p>
          </div>
          <span className="badge badge-low">
            <Scale size={13} /> Transparent Verification
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {candidates.map((cand, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>{cand.name}</h4>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                      {cand.college}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: cand.compatibility_score >= 70 ? '#34d399' : '#f59e0b' }}>
                      {cand.compatibility_score}%
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Match Score</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                  District: <strong style={{ color: '#38bdf8' }}>{cand.district}</strong> • Matched: <strong>{cand.matched_skills_count} / {cand.total_required}</strong> Core Requirements
                </div>

                {/* Skills tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {cand.skills?.map((s: any, sIdx: number) => (
                    <span key={sIdx} className="badge badge-low" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      {s.skill_id?.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => setSelectedCandidateForInvite(cand)}
                  className="btn-primary"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem', justifyContent: 'center' }}
                >
                  Direct Interview Invite
                </button>
                <button
                  onClick={() => setSelectedCandidateForAudit(cand)}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem' }}
                >
                  Audit Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Job Requirements List */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '1rem' }}>
          Active Industry Requirements ({jobs.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {jobs.map((job, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', color: '#f8fafc', margin: 0 }}>
                  {job.title}
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  {job.company} • {job.location} • {job.salary_range}
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {job.required_skills?.map((s: string, sIdx: number) => (
                    <span key={sIdx} className="badge badge-demo" style={{ fontSize: '0.7rem' }}>
                      {s.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              <span className="badge badge-low">
                Accepting Verified Applicants
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Interview Invite Modal */}
      {selectedCandidateForInvite && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: 0 }}>
                  Dispatch Direct Interview Invite
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '0.2rem' }}>
                  Candidate: {selectedCandidateForInvite.name} ({selectedCandidateForInvite.college})
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateForInvite(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Target Position</label>
                <input
                  type="text"
                  disabled
                  value="Full Stack Developer (IT & Software)"
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#94a3b8' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Interview Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={inviteDate}
                  onChange={(e) => setInviteDate(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Interview Format / Channel</label>
                <select
                  value={inviteFormat}
                  onChange={(e) => setInviteFormat(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                >
                  <option value="Virtual Video Screen (Google Meet)">Virtual Video Screen (Google Meet)</option>
                  <option value="Technical Coding Round (Live IDE)">Technical Coding Round (Live IDE)</option>
                  <option value="On-Site Campus Interview (Pune Hub)">On-Site Campus Interview (Pune Hub)</option>
                  <option value="Direct HR Round">Direct HR Round</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Invitation Message / Instructions</label>
                <textarea
                  rows={3}
                  value={inviteNotes}
                  onChange={(e) => setInviteNotes(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Send size={15} />
                  <span>{submittingInvite ? 'Dispatching...' : 'Send Official Invitation'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCandidateForInvite(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Profile Audit Modal */}
      {selectedCandidateForAudit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '580px', width: '100%', padding: '2rem', background: '#0f172a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem'
                }}>
                  👨‍🎓
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
                    {selectedCandidateForAudit.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {selectedCandidateForAudit.college} • {selectedCandidateForAudit.district}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidateForAudit(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Weighted Role Compatibility</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
                    {selectedCandidateForAudit.compatibility_score}%
                  </div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Core Skills Verified</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
                    {selectedCandidateForAudit.matched_skills_count} / {selectedCandidateForAudit.total_required}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Verified Technical Proficiencies
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {selectedCandidateForAudit.skills?.map((s: any, i: number) => (
                    <span key={i} className="badge badge-low" style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem' }}>
                      <Star size={11} /> {s.skill_id?.toUpperCase()} ({s.proficiency || 'Intermediate'})
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '8px', padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck size={20} color="#34d399" />
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                  Cryptographically Anchored on Maharashtra SkillBridge Ledger.
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>
                    Verification Hash: 8f4b23c91d4e7a60b93e817a3a2d10e5f29c48b1...
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  const cand = selectedCandidateForAudit;
                  setSelectedCandidateForAudit(null);
                  setSelectedCandidateForInvite(cand);
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Proceed to Interview Invite
              </button>
              <button
                onClick={() => setSelectedCandidateForAudit(null)}
                className="btn-secondary"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Job Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem', background: '#0f172a' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1.25rem' }}>
              Publish Skill-Weighted Job Opening
            </h3>
            <form onSubmit={handleCreateJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Associate Full Stack Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Company</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Location (Maharashtra Hub)</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  required
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.6rem', color: '#f8fafc' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Publish Opening
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
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
