import React from 'react';
import {
  LayoutDashboard,
  Award,
  GitCompare,
  Milestone,
  FileText,
  BookOpen,
  FolderGit2,
  Bot,
  Building2,
  GraduationCap,
  ClipboardCheck,
  MapPin,
  ShieldCheck,
  MessageSquare,
  Lock,
  Flame,
  Binary,
  Home,
  Compass,
  UserCheck,
  Sparkles,
  Briefcase,
  Bell,
  Clock,
  FileCheck,
  Activity
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentRole: string;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  language
}) => {
  const t = TRANSLATIONS[language];

  // Modules definition with role access control
  const navSections = [
    {
      title: "Core Student Experience",
      items: [
        { id: "home", label: "3D Career Home", icon: Home, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] },
        { id: "dashboard", label: t.nav_dashboard, icon: LayoutDashboard, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] },
        { id: "skills", label: t.nav_skills, icon: Award, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "skill_gap", label: t.nav_skill_gap, icon: GitCompare, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "government_admin"] },
        { id: "roadmap", label: t.nav_roadmap, icon: Milestone, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "resume", label: t.nav_resume, icon: FileText, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "courses", label: t.nav_courses, icon: BookOpen, allowedRoles: ["student", "trainer_faculty", "training_institute", "government_admin"] },
        { id: "projects", label: t.nav_projects, icon: FolderGit2, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "ai_assistant", label: t.nav_ai_assistant, icon: Bot, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] }
      ]
    },
    {
      title: "Career Intelligence / Copilot",
      items: [
        { id: "career_dashboard", label: "Career Dashboard", icon: Compass, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] },
        { id: "career_profile", label: "Profile Builder", icon: UserCheck, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "career_profile_analyzer", label: "Profile Analyzer", icon: Sparkles, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "career_jobs", label: "Job Discovery & Match", icon: Briefcase, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] },
        { id: "career_job_alerts", label: "Student Job Alerts", icon: Bell, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] },
        { id: "career_applications", label: "Application Tracker", icon: Clock, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "career_resume_customizer", label: "Resume Customizer", icon: FileCheck, allowedRoles: ["student", "trainer_faculty", "government_admin"] },
        { id: "career_sync_monitor", label: "Job Sync Monitor", icon: Activity, allowedRoles: ["government_admin", "industry_employer"] }
      ]
    },
    {
      title: "Institutional & Industry Hubs",
      items: [
        { id: "industry", label: t.nav_industry, icon: Building2, allowedRoles: ["industry_employer", "government_admin"] },
        { id: "institute", label: t.nav_institute, icon: GraduationCap, allowedRoles: ["training_institute", "trainer_faculty", "government_admin"] },
        { id: "reviewer", label: t.role_reviewer, icon: ClipboardCheck, allowedRoles: ["skill_reviewer", "government_admin"] },
        { id: "admin_intelligence", label: t.nav_admin_intelligence, icon: MapPin, allowedRoles: ["government_admin"] },
        { id: "permissions", label: t.nav_permissions, icon: ShieldCheck, allowedRoles: ["government_admin"] }
      ]
    },
    {
      title: "SIH Differentiators",
      items: [
        { id: "whatsapp", label: t.nav_whatsapp, icon: MessageSquare, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] },
        { id: "credential_ledger", label: t.nav_credential_ledger, icon: Binary, allowedRoles: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"] }
      ]
    }
  ];

  return (
    <aside style={{
      width: '270px',
      minWidth: '270px',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.75rem',
      gap: '1.25rem',
      overflowY: 'auto',
      height: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px'
    }}>
      {navSections.map((section, idx) => (
        <div key={idx}>
          <div style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
            fontWeight: 700,
            padding: '0 0.75rem 0.5rem 0.75rem'
          }}>
            {section.title}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAllowed = item.allowedRoles.includes(currentRole);

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                    color: isActive ? '#38bdf8' : (isAllowed ? '#cbd5e1' : '#64748b'),
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Icon size={17} color={isActive ? '#38bdf8' : (isAllowed ? '#94a3b8' : '#475569')} />
                    <span>{item.label}</span>
                  </div>

                  {!isAllowed && (
                    <span title="Restricted for current role">
                      <Lock size={12} color="#64748b" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Gamification Streak Footer */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          borderRadius: '8px',
          padding: '0.4rem',
          color: '#f59e0b'
        }}>
          <Flame size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>
            Maharashtra Skill Streak
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            Level 4 Explorer • 1,450 XP
          </div>
        </div>
      </div>
    </aside>
  );
};
