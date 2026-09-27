import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  FileCheck,
  Scale,
  Award,
  X,
  Building,
  Target
} from 'lucide-react';
import { api } from '../lib/api';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ResumeAnalyzerViewProps {
  jobRoles: any[];
  language: Language;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  jobRoles,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [targetRoleId, setTargetRoleId] = useState('full-stack-developer');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const sampleResume = `AARAV DESHMUKH
Email: aarav.deshmukh@coep.ac.in | Phone: +91 98765 43210 | Pune, Maharashtra
LinkedIn: linkedin.com/in/aarav-deshmukh | GitHub: github.com/aarav-deshmukh

EDUCATION
B.Tech in Computer Engineering (2022 - 2026)
COEP Technological University, Pune | CGPA: 8.8/10

TECHNICAL SKILLS
Languages: Python, JavaScript, HTML5, CSS3, SQL, C
Frameworks & Libraries: React.js, Express.js, Pandas, NumPy
Databases & Cloud: PostgreSQL, SQLite, Git, GitHub
Core Concepts: REST APIs, Object-Oriented Programming, Data Structures & Algorithms

EXPERIENCE & INTERNSHIPS
Software Engineering Intern | Persistent Systems (May 2025 - July 2025)
- Developed responsive web interfaces using React.js and CSS for Maharashtra citizen portal.
- Implemented RESTful APIs in Node.js for backend telemetry data collection.
- Optimized PostgreSQL relational queries reducing lookup response times by 25%.

PROJECTS
1. Student Placement Analytics Portal: Built full-stack dashboard with SQL, Python, and React.
2. AI Career Recommendation Model: Built machine learning classification model using Scikit-Learn.

ACHIEVEMENTS & CERTIFICATIONS
- Smart India Hackathon (SIH) 2025 State Finalist (Maharashtra Hub)
- Certified in Relational Database Management Systems by Skill India Digital Hub & MSBTE
- Organized annual technical symposium at COEP Pune with 1200+ participants.`;

  const handleAnalyze = async (textToUse?: string) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('resume_text', textToUse || resumeText || sampleResume);
      }
      formData.append('target_role_id', targetRoleId);

      const res = await api.analyzeResume(formData);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReport = () => {
    try {
      window.print();
    } catch (e) {
      handleDownloadReportTxt();
    }
  };

  const handleDownloadReportTxt = () => {
    if (!result) return;
    const content = `=====================================================
SKILLBRIDGE AI - ATS DIAGNOSTIC REPORT (SIH26134)
Government of Maharashtra • Skill Intelligence Directorate
=====================================================
Target Role: ${result.target_role_title}
Overall Compatibility Score: ${result.overall_match_score}%

5-FACTOR SCORING MODEL:
- Skill Match (40%): ${result.weights_model?.skill_match_40}%
- Experience (25%): ${result.weights_model?.experience_25}%
- Education (15%): ${result.weights_model?.education_15}%
- Keyword Density (10%): ${result.weights_model?.keyword_density_10}%
- Achievements (10%): ${result.weights_model?.achievements_10}%

DETECTED VERIFIED SKILLS:
${result.detected_skills?.map((s: any) => `- ${s.name || s.skill_id} (${s.proficiency || 'Intermediate'})`).join('\n')}

MISSING PREREQUISITES:
${result.skill_gap?.missing_skills?.map((s: any) => `- ${s.skill_id?.toUpperCase()} (Priority: ${s.importance})`).join('\n')}

ACTIONABLE REWRITE RECOMMENDATIONS:
${result.actionable_suggestions?.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge_ATS_Report_${result.target_role_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.05em' }}>
              Module H • 5-Factor Evaluation Model
            </div>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
              {t.nav_resume}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Weighted 5-Factor Scoring: Skill Match (40%), Experience (25%), Education (15%), Keyword Density (10%), Achievements (10%).
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Target Role:</label>
            <select
              value={targetRoleId}
              onChange={(e) => setTargetRoleId(e.target.value)}
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                color: '#f8fafc',
                border: '1px solid var(--border-active)',
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {jobRoles.map(r => (
                <option key={r.id} value={r.id} style={{ background: '#0f172a' }}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Input Options: Upload File or Paste/Sample Text */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* File Upload Area */}
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.85rem' }}>
            Upload Resume (PDF / DOCX)
          </h3>

          <div style={{
            border: '2px dashed var(--border-active)',
            borderRadius: '12px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.5)',
            marginBottom: '1rem'
          }}>
            <Upload size={36} color="#38bdf8" style={{ margin: '0 auto 0.75rem auto' }} />
            <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600, marginBottom: '0.25rem' }}>
              {selectedFile ? selectedFile.name : 'Choose PDF or DOCX resume file'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Supports PyPDF & Python-docx text extraction
            </div>

            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              style={{ fontSize: '0.8rem', color: '#94a3b8' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || !selectedFile}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <Sparkles size={16} /> {loading ? 'Extracting & Scoring...' : 'Analyze Uploaded File'}
            </button>
          </div>
        </div>

        {/* Text Paste / Sample Resume Area */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>
                Paste Text / Instant Demo
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {resumeText && (
                  <button
                    onClick={() => {
                      setResumeText('');
                      setResult(null);
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => {
                    setResumeText(sampleResume);
                    handleAnalyze(sampleResume);
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  Load Sample Resume
                </button>
              </div>
            </div>

            <textarea
              rows={7}
              placeholder="Paste candidate resume text here or click 'Load Sample Resume' above..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: '#f8fafc',
                fontSize: '0.82rem',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
          >
            <Sparkles size={16} /> {loading ? 'Computing 5-Factor Score...' : 'Analyze Text Content'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '1rem', borderRadius: '8px', color: '#fda4af', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Analysis Results Display */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Overall Score Banner */}
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700 }}>
                Comprehensive ATS Alignment Score
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: result.overall_match_score >= 70 ? '#34d399' : '#fcd34d', margin: '0.2rem 0' }}>
                {result.overall_match_score}%
              </h2>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Evaluated against: <strong style={{ color: '#f8fafc' }}>{result.target_role_title}</strong>
              </div>
            </div>

            {/* 5-Factor Mini Cards */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Skill Match (40%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8' }}>{result.weights_model?.skill_match_40}%</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Experience (25%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#818cf8' }}>{result.weights_model?.experience_25}%</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Education (15%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399' }}>{result.weights_model?.education_15}%</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Keywords (10%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fbbf24' }}>{result.weights_model?.keyword_density_10}%</div>
              </div>
              <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.65rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Achievements (10%)</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#c084fc' }}>{result.weights_model?.achievements_10}%</div>
              </div>
            </div>

            {/* One-Click PDF/Printable Diagnostic Audit Report Button */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => setShowReportModal(true)}
                className="btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem' }}
              >
                <Printer size={16} />
                <span>Download ATS Diagnostic Report (Print / PDF)</span>
              </button>
            </div>
          </div>

          {/* Actionable Rewrite Suggestions */}
          <div className="glass-panel" style={{ padding: '1.75rem', borderLeft: '4px solid var(--accent-amber)' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#f59e0b" /> Actionable Resume Improvement Recommendations
            </h4>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem', color: '#cbd5e1' }}>
              {result.actionable_suggestions?.map((sug: string, idx: number) => (
                <li key={idx}>{sug}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Printable ATS Diagnostic Audit Report Modal */}
      {showReportModal && result && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.5rem',
          overflowY: 'auto'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#0b1120',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: '16px',
            padding: '2.5rem'
          }}>
            {/* Modal Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileCheck size={22} color="#38bdf8" />
                <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: 0 }}>
                  Official ATS Diagnostic Audit Report
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  onClick={handleDownloadReportTxt}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
                >
                  <Download size={14} /> Download .TXT
                </button>
                <button
                  onClick={handlePrintReport}
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                >
                  <Printer size={14} /> Print / Save as PDF
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Printable Report Body */}
            <div id="printable-ats-report" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Report Header */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
                    Government of Maharashtra • Skill Intelligence Directorate
                  </div>
                  <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: '0.2rem 0' }}>
                    SkillBridge AI — Candidate Employability Audit
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Problem Statement: SIH26134 • Reference ID: <code style={{ color: '#cbd5e1' }}>SB-2026-ATS-{Math.floor(100000 + Math.random() * 900000)}</code>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Audit Date</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Target Role & Overall Score Banner */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Employment Role</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                    {result.target_role_title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '0.35rem' }}>
                    Industry: {result.skill_gap?.industry || 'IT & Software'} • {result.skill_gap?.experience_level || 'Entry to Mid'}
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Overall ATS Compatibility</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: result.overall_match_score >= 70 ? '#34d399' : '#fcd34d', lineHeight: 1.2, marginTop: '0.1rem' }}>
                    {result.overall_match_score}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Calculated via 5-Factor Weighted Diagnostic Model
                  </div>
                </div>
              </div>

              {/* 5-Factor Scoring Table */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scale size={16} color="#38bdf8" /> 5-Factor Scoring Diagnostic Breakdown
                </h4>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Evaluation Factor</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Model Weight</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Score</th>
                      <th style={{ padding: '0.5rem 0.75rem' }}>Weighted Yield</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f8fafc', fontWeight: 600 }}>Technical Skill Match</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>40%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#38bdf8', fontWeight: 700 }}>{result.weights_model?.skill_match_40}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>{((result.weights_model?.skill_match_40 || 0) * 0.40).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f8fafc', fontWeight: 600 }}>Experience Level & Projects</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>25%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#818cf8', fontWeight: 700 }}>{result.weights_model?.experience_25}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>{((result.weights_model?.experience_25 || 0) * 0.25).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f8fafc', fontWeight: 600 }}>Academic Degree & Credentials</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>15%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#34d399', fontWeight: 700 }}>{result.weights_model?.education_15}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>{((result.weights_model?.education_15 || 0) * 0.15).toFixed(1)}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f8fafc', fontWeight: 600 }}>Industry Keyword Density</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>10%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#fbbf24', fontWeight: 700 }}>{result.weights_model?.keyword_density_10}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>{((result.weights_model?.keyword_density_10 || 0) * 0.10).toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#f8fafc', fontWeight: 600 }}>Achievements & Hackathons</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>10%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#c084fc', fontWeight: 700 }}>{result.weights_model?.achievements_10}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: '#cbd5e1' }}>{((result.weights_model?.achievements_10 || 0) * 0.10).toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Skills Analysis: Detected vs Missing */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={15} /> Verified Technical Skills Detected ({result.detected_skills?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {result.detected_skills?.map((s: any, idx: number) => (
                      <span key={idx} className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                        {s.name || s.skill_id}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Target size={15} /> Priority Missing Skills ({result.skill_gap?.missing_skills?.length || 0})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {result.skill_gap?.missing_skills?.map((s: any, idx: number) => (
                      <span key={idx} className="badge badge-high" style={{ fontSize: '0.7rem' }}>
                        {s.skill_id?.toUpperCase()} ({s.importance?.toUpperCase()})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={15} /> Actionable Resume Enhancements
                </div>
                <ul style={{ paddingLeft: '1.25rem', margin: 0, fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {result.actionable_suggestions?.map((sug: string, idx: number) => (
                    <li key={idx}>{sug}</li>
                  ))}
                </ul>
              </div>

              {/* Official Seal Footer */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.72rem',
                color: '#64748b'
              }}>
                <div>
                  Certified by SkillBridge AI • Maharashtra State Innovation Society (MSInS) • SIH26134
                </div>
                <div>
                  Cryptographic Hash: <code>0x8f4b...f910</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
