import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AccessRestricted } from './components/AccessRestricted';
import { StudentSkillProfile } from './components/StudentSkillProfile';
import { SkillGapAnalyzerView } from './components/SkillGapAnalyzerView';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { CourseRecommendationsView } from './components/CourseRecommendationsView';
import { ProjectRecommendationsView } from './components/ProjectRecommendationsView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { AICareerAssistantView } from './components/AICareerAssistantView';
import { IndustryView } from './components/IndustryView';
import { InstituteView } from './components/InstituteView';
import { ReviewerView } from './components/ReviewerView';
import { AdminView } from './components/AdminView';
import { PermissionsView } from './components/PermissionsView';
import { WhatsAppSimulator } from './components/WhatsAppSimulator';
import { CredentialLedgerView } from './components/CredentialLedgerView';

// Career Intelligence & Copilot Views
import { HomeView } from './components/HomeView';
import { AuthModal } from './components/AuthModal';
import { NotificationModal } from './components/NotificationModal';
import { CareerDashboardView } from './components/CareerDashboardView';
import { CareerProfileView } from './components/CareerProfileView';
import { CareerProfileAnalyzerView } from './components/CareerProfileAnalyzerView';
import { CareerJobsView } from './components/CareerJobsView';
import { CareerJobAlertsView } from './components/CareerJobAlertsView';
import { CareerApplicationsView } from './components/CareerApplicationsView';
import { CareerResumeCustomizerView } from './components/CareerResumeCustomizerView';
import { CareerSyncMonitorView } from './components/CareerSyncMonitorView';

import { api } from './lib/api';
import { authService, StudentUser } from './lib/auth';
import { Language, TRANSLATIONS } from './lib/translations';

export const App: React.FC = () => {
  // State: Role, Language, Active Tab
  const [currentRole, setCurrentRole] = useState<string>('student');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Auth & Notifications Modal State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Core Data States
  const [jobRoles, setJobRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('full-stack-developer');
  const [studentSkills, setStudentSkills] = useState<any[]>([
    { skill_id: 'html', proficiency: 'Advanced' },
    { skill_id: 'css', proficiency: 'Advanced' },
    { skill_id: 'javascript', proficiency: 'Intermediate' },
    { skill_id: 'sql', proficiency: 'Intermediate' }
  ]);
  const [gapData, setGapData] = useState<any>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [recommendedProjects, setRecommendedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bgTheme, setBgTheme] = useState<string>('prism');

  // Tab permissions configuration
  const tabRolePermissions: Record<string, string[]> = {
    home: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    dashboard: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    skills: ["student", "trainer_faculty", "government_admin"],
    skill_gap: ["student", "trainer_faculty", "training_institute", "industry_employer", "government_admin"],
    roadmap: ["student", "trainer_faculty", "government_admin"],
    resume: ["student", "trainer_faculty", "government_admin"],
    courses: ["student", "trainer_faculty", "training_institute", "government_admin"],
    projects: ["student", "trainer_faculty", "government_admin"],
    ai_assistant: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    // Career Copilot Tabs
    career_dashboard: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    career_profile: ["student", "trainer_faculty", "government_admin"],
    career_profile_analyzer: ["student", "trainer_faculty", "government_admin"],
    career_jobs: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    career_job_alerts: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    career_applications: ["student", "trainer_faculty", "government_admin"],
    career_resume_customizer: ["student", "trainer_faculty", "government_admin"],
    career_sync_monitor: ["government_admin", "industry_employer"],
    // Institutional & Industry Hubs
    industry: ["industry_employer", "government_admin"],
    institute: ["training_institute", "trainer_faculty", "government_admin"],
    reviewer: ["skill_reviewer", "government_admin"],
    admin_intelligence: ["government_admin"],
    permissions: ["government_admin"],
    whatsapp: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"],
    credential_ledger: ["student", "trainer_faculty", "training_institute", "industry_employer", "skill_reviewer", "government_admin"]
  };

  // Initial Data Fetch
  useEffect(() => {
    api.getJobRoles()
      .then(roles => {
        setJobRoles(roles);
        if (roles.length > 0) {
          setSelectedRoleId(roles[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Compute Skill Gap & Recommendations whenever skills or target role changes
  useEffect(() => {
    if (!selectedRoleId) return;
    setLoading(true);
    api.analyzeSkillGap(studentSkills, selectedRoleId, currentRole)
      .then(res => {
        setGapData(res);
        const missing = res.missing_skills?.map((s: any) => s.skill_id) || [];
        return Promise.all([
          api.getRecommendedCourses(missing),
          api.getRecommendedProjects(missing)
        ]);
      })
      .then(([courses, projects]) => {
        setRecommendedCourses(courses);
        setRecommendedProjects(projects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedRoleId, studentSkills, currentRole]);

  // Handle Demo Role Change (Judges Switcher)
  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    // Switch to role's primary dashboard if active tab is restricted
    const allowed = tabRolePermissions[activeTab] || [];
    if (!allowed.includes(newRole)) {
      if (newRole === 'industry_employer') setActiveTab('industry');
      else if (newRole === 'training_institute' || newRole === 'trainer_faculty') setActiveTab('institute');
      else if (newRole === 'skill_reviewer') setActiveTab('reviewer');
      else if (newRole === 'government_admin') setActiveTab('admin_intelligence');
      else setActiveTab('home');
    }
  };

  // Add new skill to student profile
  const handleAddSkill = (skillName: string, proficiency: string) => {
    const cleanId = skillName.trim().toLowerCase();
    if (!studentSkills.some(s => s.skill_id === cleanId)) {
      setStudentSkills(prev => [...prev, { skill_id: cleanId, proficiency }]);
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    setStudentSkills(prev => prev.filter(s => (s.skill_id || s.name || '').toLowerCase() !== skillId.toLowerCase()));
  };

  const handleResetSkills = () => {
    setStudentSkills([
      { skill_id: 'html', proficiency: 'Advanced' },
      { skill_id: 'css', proficiency: 'Advanced' },
      { skill_id: 'javascript', proficiency: 'Intermediate' },
      { skill_id: 'sql', proficiency: 'Intermediate' }
    ]);
  };

  // Verify access for active tab
  const isTabAllowed = (tabRolePermissions[activeTab] || []).includes(currentRole);

  const t = TRANSLATIONS[language];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Dynamic Multi-Color Ambient Background System */}
      <div className={`multicolor-bg-canvas theme-${bgTheme}`}>
        <div className="multicolor-orb orb-cyan" />
        <div className="multicolor-orb orb-magenta" />
        <div className="multicolor-orb orb-violet" />
        <div className="multicolor-orb orb-emerald" />
        <div className="multicolor-orb orb-amber" />
      </div>

      {/* Global Header with Notifications, Auth, Multi-Color Palette, Demo Role Switcher & Trilingual Selector */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={setLanguage}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        currentUser={currentUser}
        onSignOut={() => {
          authService.logout();
          setCurrentUser(null);
          setIsAuthModalOpen(true);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        bgTheme={bgTheme}
        onBgThemeChange={setBgTheme}
      />

      {/* Auth Modal Overlay */}
      {isAuthModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999999 }}>
          <AuthModal
            onAuthSuccess={(user: StudentUser) => {
              setCurrentUser(user);
              setIsAuthModalOpen(false);
              setActiveTab('home');
            }}
            onExploreDemo={() => {
              setIsAuthModalOpen(false);
              setActiveTab('home');
            }}
          />
        </div>
      )}

      {/* Notifications Drawer Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab: string) => {
          setActiveTab(tab);
          setIsNotificationsOpen(false);
        }}
      />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Role-Gated Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentRole={currentRole}
          language={language}
        />

        {/* Main Content Surface */}
        <main style={{
          flex: 1,
          padding: activeTab === 'home' ? '0' : '2rem',
          overflowY: 'auto'
        }}>
          {!isTabAllowed ? (
            <div style={{ padding: '2rem' }}>
              <AccessRestricted
                currentRole={currentRole}
                requiredRoleOrPermission={(tabRolePermissions[activeTab] || []).join(' or ')}
                onReturn={() => setActiveTab('home')}
              />
            </div>
          ) : (
            <>
              {/* 3D Career Home */}
              {activeTab === 'home' && (
                <HomeView
                  onNavigateTab={setActiveTab}
                  language={language}
                />
              )}

              {/* Dashboard / Skill Gap Analyzer */}
              {(activeTab === 'dashboard' || activeTab === 'skill_gap') && (
                <SkillGapAnalyzerView
                  jobRoles={jobRoles}
                  selectedRoleId={selectedRoleId}
                  onSelectRole={setSelectedRoleId}
                  gapData={gapData}
                  onNavigateTab={setActiveTab}
                  language={language}
                />
              )}

              {/* Student Skill Profile */}
              {activeTab === 'skills' && (
                <StudentSkillProfile
                  skills={studentSkills}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                  onResetSkills={handleResetSkills}
                  language={language}
                />
              )}

              {/* Career Roadmap */}
              {activeTab === 'roadmap' && (
                <CareerRoadmapView
                  targetRoleTitle={gapData?.role_title || "Full Stack Developer"}
                  roadmapSteps={gapData?.roadmap || []}
                  language={language}
                />
              )}

              {/* Course Recommendations */}
              {activeTab === 'courses' && (
                <CourseRecommendationsView
                  courses={recommendedCourses}
                  missingSkills={gapData?.missing_skills?.map((s: any) => s.skill_id) || []}
                  language={language}
                />
              )}

              {/* Project Recommendations */}
              {activeTab === 'projects' && (
                <ProjectRecommendationsView
                  projects={recommendedProjects}
                  missingSkills={gapData?.missing_skills?.map((s: any) => s.skill_id) || []}
                  language={language}
                />
              )}

              {/* Resume Analyzer */}
              {activeTab === 'resume' && (
                <ResumeAnalyzerView
                  jobRoles={jobRoles}
                  language={language}
                />
              )}

              {/* AI Career Assistant */}
              {activeTab === 'ai_assistant' && (
                <AICareerAssistantView
                  studentProfile={{ name: currentUser?.displayName || "Aarav Deshmukh", skills: studentSkills }}
                  gapData={gapData}
                  language={language}
                />
              )}

              {/* Career Intelligence / Copilot Views */}
              {activeTab === 'career_dashboard' && (
                <CareerDashboardView
                  onNavigateTab={setActiveTab}
                  language={language}
                />
              )}

              {activeTab === 'career_profile' && (
                <CareerProfileView
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'career_profile_analyzer' && (
                <CareerProfileAnalyzerView
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'career_jobs' && (
                <CareerJobsView
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'career_job_alerts' && (
                <CareerJobAlertsView
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'career_applications' && (
                <CareerApplicationsView
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'career_resume_customizer' && (
                <CareerResumeCustomizerView
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'career_sync_monitor' && (
                <CareerSyncMonitorView
                  onNavigateTab={setActiveTab}
                />
              )}

              {/* Industry / Recruiter Portal */}
              {activeTab === 'industry' && (
                <IndustryView
                  currentRole={currentRole}
                  language={language}
                />
              )}

              {/* Training Institute Alignment */}
              {activeTab === 'institute' && (
                <InstituteView
                  currentRole={currentRole}
                  language={language}
                />
              )}

              {/* Skill Authority Reviewer */}
              {activeTab === 'reviewer' && (
                <ReviewerView
                  currentRole={currentRole}
                  language={language}
                />
              )}

              {/* Government / Admin Intelligence */}
              {activeTab === 'admin_intelligence' && (
                <AdminView
                  currentRole={currentRole}
                  language={language}
                />
              )}

              {/* RBAC & Permissions Management */}
              {activeTab === 'permissions' && (
                <PermissionsView
                  currentRole={currentRole}
                  language={language}
                />
              )}

              {/* WhatsApp Career Bot Simulator */}
              {activeTab === 'whatsapp' && (
                <WhatsAppSimulator
                  language={language}
                />
              )}

              {/* Tamper-Evident Credential Ledger */}
              {activeTab === 'credential_ledger' && (
                <CredentialLedgerView
                  language={language}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
