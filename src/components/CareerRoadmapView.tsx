import React, { useState } from 'react';
import { Milestone, CheckCircle2, Clock, CircleDot, ArrowRight, Award, Zap } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface CareerRoadmapViewProps {
  targetRoleTitle: string;
  roadmapSteps: string[];
  language: Language;
}

type StepStatus = 'Completed' | 'Learning' | 'Not Started';

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({
  targetRoleTitle,
  roadmapSteps,
  language
}) => {
  const t = TRANSLATIONS[language];

  // Default roadmap statuses with initial realistic completion
  const [statuses, setStatuses] = useState<Record<number, StepStatus>>({
    0: 'Completed',
    1: 'Completed',
    2: 'Learning',
    3: 'Not Started',
    4: 'Not Started',
    5: 'Not Started',
    6: 'Not Started',
    7: 'Not Started'
  });

  const toggleStatus = (idx: number) => {
    setStatuses(prev => {
      const current = prev[idx] || 'Not Started';
      const next: StepStatus = current === 'Not Started' ? 'Learning' : (current === 'Learning' ? 'Completed' : 'Not Started');
      return { ...prev, [idx]: next };
    });
  };

  const steps = roadmapSteps.length > 0 ? roadmapSteps : [
    "HTML5 & Responsive CSS Foundations",
    "Modern JavaScript (ES6+)",
    "Frontend Framework with React & State",
    "Server-Side Development with Node.js & Express",
    "Relational Databases with PostgreSQL & SQL",
    "RESTful API Architecture & Authentication",
    "Full Stack Capstone Portfolio Project",
    "AICTE Internship & Placement Interview Readiness"
  ];

  const completedCount = Object.values(statuses).filter(s => s === 'Completed').length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header & Progress Stats */}
      <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <Milestone size={16} /> Structured Career Path
          </div>
          <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: '0.2rem 0 0 0' }}>
            {targetRoleTitle} Roadmap
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
            Linear competency progression mapped to Maharashtra State Board of Technical Education & industry guidelines.
          </p>
        </div>

        <div style={{
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          minWidth: '220px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
            <span>Milestones Cleared:</span>
            <strong style={{ color: '#f8fafc' }}>{completedCount} / {steps.length}</strong>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPct}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #06b6d4, #6366f1)',
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.4rem', textAlign: 'right', fontWeight: 600 }}>
            {progressPct}% Completed
          </div>
        </div>
      </div>

      {/* Interactive Linear Roadmap Steps */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {steps.map((step, idx) => {
            const status = statuses[idx] || 'Not Started';
            const isCompleted = status === 'Completed';
            const isLearning = status === 'Learning';

            return (
              <div
                key={idx}
                onClick={() => toggleStatus(idx)}
                className="glass-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 1.5rem',
                  cursor: 'pointer',
                  borderLeft: isCompleted ? '4px solid #10b981' : (isLearning ? '4px solid #38bdf8' : '4px solid #64748b'),
                  background: isLearning ? 'rgba(56, 189, 248, 0.08)' : undefined
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  {/* Step Sequence Badge */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.2)' : (isLearning ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.06)'),
                    color: isCompleted ? '#34d399' : (isLearning ? '#38bdf8' : '#94a3b8'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem'
                  }}>
                    {isCompleted ? <CheckCircle2 size={18} /> : (idx + 1)}
                  </div>

                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: isCompleted ? '#f8fafc' : (isLearning ? '#38bdf8' : '#cbd5e1'),
                      fontSize: '0.98rem',
                      textDecoration: isCompleted ? 'line-through' : 'none'
                    }}>
                      {step}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      Estimated duration: 2-3 weeks • Click card to cycle status
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${isCompleted ? 'badge-low' : (isLearning ? 'badge-demo' : '')}`} style={status === 'Not Started' ? { background: 'rgba(255,255,255,0.06)', color: '#94a3b8' } : {}}>
                    {isCompleted && <CheckCircle2 size={12} />}
                    {isLearning && <Clock size={12} />}
                    {status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
