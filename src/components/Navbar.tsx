import React from 'react';
import { Shield, Sparkles, Globe, ChevronDown, Bell, LogIn, LogOut, User, Palette } from 'lucide-react';
import { Language, TRANSLATIONS } from '../lib/translations';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenNotifications?: () => void;
  currentUser?: any;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  bgTheme?: string;
  onBgThemeChange?: (theme: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  onOpenNotifications,
  currentUser,
  onSignOut,
  onOpenAuth,
  bgTheme = 'prism',
  onBgThemeChange
}) => {
  const t = TRANSLATIONS[language];

  const roles = [
    { id: 'student', label: t.role_student, icon: '👨‍🎓', desc: 'Profile, Skill Gap, Roadmap, Resume' },
    { id: 'trainer_faculty', label: t.role_faculty, icon: '👨‍🏫', desc: 'Course Management, Progress Logs' },
    { id: 'training_institute', label: t.role_institute, icon: '🎓', desc: 'Department Skill Gaps vs Demand' },
    { id: 'industry_employer', label: t.role_employer, icon: '🏢', desc: 'Candidate Sourcing, Job Criteria' },
    { id: 'skill_reviewer', label: t.role_reviewer, icon: '🔍', desc: 'Curriculum & Quality Standards Review' },
    { id: 'government_admin', label: t.role_admin, icon: '🏛️', desc: 'Regional Intelligence, RBAC & Policy' }
  ];

  const currentRoleInfo = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(10, 15, 29, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1.5rem'
    }}>
      {/* Brand & Maharashtra Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
        }}>
          <Sparkles size={22} color="#ffffff" />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              {t.app_name}
            </h1>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}>
              SIH26134
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            <span>{t.government_badge}</span>
            <span>•</span>
            <span style={{ color: '#38bdf8' }}>Govt of Maharashtra</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Notifications, Language Selector, Demo Badge, Role Dropdown, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Notification Bell Icon Button */}
        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            title="Open Career & Job Notifications"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'rgba(30, 41, 59, 0.6)',
              color: '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Bell size={17} />
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#00d4ff',
              boxShadow: '0 0 8px #00d4ff'
            }} />
          </button>
        )}

        {/* Language Selector (MR / HI / EN) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0.2rem 0.4rem',
          fontSize: '0.8rem'
        }}>
          <Globe size={14} color="#94a3b8" style={{ marginRight: '0.4rem' }} />
          {(['en', 'mr', 'hi'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              style={{
                background: language === lang ? 'var(--accent-indigo)' : 'transparent',
                color: language === lang ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {lang === 'en' ? 'EN' : (lang === 'mr' ? 'मराठी' : 'हिंदी')}
            </button>
          ))}
        </div>

        {/* Multi-Color Background Palette Switcher */}
        {onBgThemeChange && (
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(236, 72, 153, 0.15))',
            border: '1px solid rgba(0, 212, 255, 0.35)',
            borderRadius: '8px',
            padding: '0.2rem 0.5rem',
            boxShadow: '0 0 15px rgba(0, 212, 255, 0.15)'
          }}>
            <Palette size={14} color="#00d4ff" style={{ marginRight: '0.35rem' }} />
            <select
              value={bgTheme}
              onChange={(e) => onBgThemeChange(e.target.value)}
              title="Multi-Color Background Theme"
              style={{
                background: 'transparent',
                color: '#f8fafc',
                border: 'none',
                outline: 'none',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <option value="prism" style={{ background: '#0a0f1d', color: '#f8fafc' }}>🌈 Cosmic Prism (Multi-Color)</option>
              <option value="aurora" style={{ background: '#0a0f1d', color: '#f8fafc' }}>✨ Cyber Aurora (Cyan & Teal)</option>
              <option value="sunset" style={{ background: '#0a0f1d', color: '#f8fafc' }}>🌅 Sunset Nebula (Amber & Rose)</option>
              <option value="spectrum" style={{ background: '#0a0f1d', color: '#f8fafc' }}>⚡ Neon Spectrum (Vivid Mix)</option>
            </select>
          </div>
        )}

        {/* Demo Mode Badge */}
        <div className="badge badge-demo" title="Role switcher active for SIH evaluation">
          <Shield size={13} />
          <span>{t.demo_mode}</span>
        </div>

        {/* Interactive Demo Role Switcher */}
        <div style={{ position: 'relative' }}>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            style={{
              appearance: 'none',
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#f8fafc',
              border: '1px solid var(--border-active)',
              borderRadius: '10px',
              padding: '0.55rem 2.2rem 0.55rem 0.9rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
            }}
          >
            {roles.map(r => (
              <option key={r.id} value={r.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                {r.icon} {r.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            color="#94a3b8"
            style={{
              position: 'absolute',
              right: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* User Account / Auth Button */}
        {currentUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              {currentUser.displayName ? currentUser.displayName.charAt(0) : 'A'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                {currentUser.displayName || 'Demo Student'}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#38bdf8' }}>
                {currentUser.college || 'COEP Tech, Pune'}
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '0.2rem'
                }}
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.9rem',
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogIn size={14} />
            <span>Sign In / Demo</span>
          </button>
        )}
      </div>
    </header>
  );
};
