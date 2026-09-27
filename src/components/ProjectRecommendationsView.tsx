import React, { useState } from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Code2,
  ArrowUpRight,
  Clock,
  Target,
  X,
  Layers,
  Sparkles,
  GitBranch,
  Copy,
  Check
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface ProjectRecommendationsViewProps {
  projects: any[];
  missingSkills: string[];
  language: Language;
}

export const ProjectRecommendationsView: React.FC<ProjectRecommendationsViewProps> = ({
  projects,
  missingSkills,
  language
}) => {
  const t = TRANSLATIONS[language];
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [startedProjects, setStartedProjects] = useState<Record<string, boolean>>({});

  const handleCopySpecs = (proj: any) => {
    const text = `SkillBridge AI Project Specification:\nTitle: ${proj.title}\nSolves Skill Gap: ${proj.missing_skill_id}\nDifficulty: ${proj.difficulty}\nDuration: ${proj.duration}\nTechnologies: ${proj.technologies?.join(', ')}\nExpected Outcome: ${proj.expected_outcome}\nDescription: ${proj.description}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleStartProject = (id: string) => {
    setStartedProjects(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c084fc', fontWeight: 700, letterSpacing: '0.05em' }}>
          Portfolio Gap Engineering
        </div>
        <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
          {t.explore_projects}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
          Real-world capstones designed to prove competence to Maharashtra IT employers in your missing skills.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '1.25rem'
      }}>
        {projects.map((proj, idx) => {
          const isStarted = startedProjects[proj.id || proj.title];
          return (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <span className="badge badge-demo">
                    Solves: {proj.missing_skill_id?.toUpperCase() || 'Portfolio Gap'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isStarted && (
                      <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
                        In Progress
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 600 }}>
                      {proj.difficulty}
                    </span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {proj.title}
                </h4>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '0.85rem' }}>
                  {proj.description}
                </p>

                {/* Technologies */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {proj.technologies?.map((tech: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '0.15rem 0.45rem',
                        fontSize: '0.72rem',
                        color: '#cbd5e1'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.85rem' }}>
                  <Target size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                  <span>Outcome: {proj.expected_outcome}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={13} /> {proj.duration}
                  </span>

                  <button
                    onClick={() => setSelectedProject(proj)}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                  >
                    <span>View Project Specs</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Specs Interactive Modal */}
      {selectedProject && (
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
          <div className="glass-panel" style={{
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            background: '#0f172a',
            border: '1px solid var(--border-active)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-demo" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  Solves Missing Skill: {selectedProject.missing_skill_id?.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0' }}>
                  {selectedProject.title}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Estimated Timeline: <strong style={{ color: '#38bdf8' }}>{selectedProject.duration}</strong> • Level: <strong style={{ color: '#cbd5e1' }}>{selectedProject.difficulty}</strong>
                </div>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Executive Brief
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Required Stack & Libraries
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedProject.technologies?.map((tech: string, i: number) => (
                    <span key={i} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', fontWeight: 600 }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem' }}>
                <h4 style={{ fontSize: '0.88rem', color: '#f8fafc', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Target size={16} color="#34d399" /> Verifiable Deliverable Outcome
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
                  {selectedProject.expected_outcome}
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recommended Milestones
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#38bdf8" /> Milestone 1: Initialize Git repository and environment configuration
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#38bdf8" /> Milestone 2: Implement core logic focusing on {selectedProject.missing_skill_id}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#38bdf8" /> Milestone 3: Write test cases and integrate CI/CD deployment
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={15} color="#38bdf8" /> Milestone 4: Add README architecture diagrams and demo credentials
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <button
                onClick={() => {
                  toggleStartProject(selectedProject.id || selectedProject.title);
                  setSelectedProject(null);
                }}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <GitBranch size={16} />
                <span>
                  {startedProjects[selectedProject.id || selectedProject.title] ? 'Mark as Completed' : 'Start Project (Add to Roadmap)'}
                </span>
              </button>

              <button
                onClick={() => handleCopySpecs(selectedProject)}
                className="btn-secondary"
                style={{ padding: '0.6rem 1rem' }}
              >
                {copied ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy Specs'}</span>
              </button>

              <button
                onClick={() => setSelectedProject(null)}
                className="btn-secondary"
                style={{ padding: '0.6rem 1rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
