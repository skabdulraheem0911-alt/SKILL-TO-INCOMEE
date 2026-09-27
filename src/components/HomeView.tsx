import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import {
  Activity,
  ArrowRight,
  Award,
  Bell,
  Bookmark,
  BookmarkCheck,
  Bot,
  Briefcase,
  ExternalLink,
  FileText,
  GitCompare,
  Milestone,
  Sparkles,
  Clock
} from "lucide-react";
interface HomeViewProps {
  onNavigateTab: (tabId: string) => void;
  language?: string;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab }) => {
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [careerProfile, setCareerProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [matchesRes, profileRes, appsRes] = await Promise.all([
        api.getJobMatches().catch(() => []),
        api.getCareerProfile().catch(() => null),
        api.getApplications().catch(() => [])
      ]);
      setJobMatches(matchesRes || []);
      setCareerProfile(profileRes);
      setApplications(appsRes || []);
      if (Array.isArray(appsRes)) {
        setSavedJobIds(new Set(appsRes.map((app: any) => app.jobId)));
      }
    } catch (err) {
      console.warn("Error loading home data:", err);
    }
  };

  const handleToggleSaveJob = async (job: any) => {
    const id = job.id || job.job_id;
    if (!id) return;
    if (savedJobIds.has(id)) {
      await api.unsaveJob(id).catch(console.warn);
      const next = new Set(savedJobIds);
      next.delete(id);
      setSavedJobIds(next);
    } else {
      await api.saveJob(job).catch(console.warn);
      const next = new Set(savedJobIds);
      next.add(id);
      setSavedJobIds(next);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    if (!dateStr) return "Recently";
    try {
      const diffSecs = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
      if (diffSecs < 60) return "Just now";
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch {
      return dateStr;
    }
  };

  // 8 Feature Navigation Cards with Multi-color Accents
  const featureCards = [
    {
      id: "career_profile",
      title: "PROFILE BUILDER",
      desc: "Build a professional verified profile",
      icon: Award,
      color: "#00D4FF",
      borderGlow: "rgba(0, 212, 255, 0.4)"
    },
    {
      id: "skill_gap",
      title: "SKILL GAP",
      desc: "Discover required skills to learn",
      icon: GitCompare,
      color: "#38BDF8",
      borderGlow: "rgba(56, 189, 248, 0.4)"
    },
    {
      id: "career_jobs",
      title: "JOB DISCOVERY",
      desc: "Find authorized verified opportunities",
      icon: Briefcase,
      color: "#6366F1",
      borderGlow: "rgba(99, 102, 241, 0.4)"
    },
    {
      id: "career_resume_customizer",
      title: "RESUME AI",
      desc: "ATS customize resume for specific jobs",
      icon: FileText,
      color: "#A855F7",
      borderGlow: "rgba(168, 85, 247, 0.4)"
    },
    {
      id: "career_job_alerts",
      title: "JOB ALERTS",
      desc: "Real-time match alerts & push notices",
      icon: Bell,
      color: "#F59E0B",
      borderGlow: "rgba(245, 158, 11, 0.4)"
    },
    {
      id: "career_applications",
      title: "APPLICATION TRACKER",
      desc: "8-stage visual interview pipeline",
      icon: Clock,
      color: "#EC4899",
      borderGlow: "rgba(236, 72, 153, 0.4)"
    },
    {
      id: "ai_assistant",
      title: "AI CAREER ASSISTANT",
      desc: "Grounded guidance on jobs & skills",
      icon: Bot,
      color: "#10B981",
      borderGlow: "rgba(16, 185, 129, 0.4)"
    },
    {
      id: "roadmap",
      title: "LEARNING PATH",
      desc: "Step-by-step skill mastery journey",
      icon: Milestone,
      color: "#06B6D4",
      borderGlow: "rgba(6, 182, 212, 0.4)"
    }
  ];

  // 6-step Blueprint
  const blueprintSteps = [
    { step: "01", title: "Build Your Profile", desc: "Enter verified skills, projects, and target roles.", color: "#00D4FF" },
    { step: "02", title: "Discover Skill Gaps", desc: "Weighted algorithm highlights employer prereqs.", color: "#38BDF8" },
    { step: "03", title: "Find Matching Jobs", desc: "Authorized feeds from NCS, Adzuna, and SIDH.", color: "#6366F1" },
    { step: "04", title: "Prepare Application", desc: "Grounded cover letters and recruiter notes.", color: "#A855F7" },
    { step: "05", title: "Track Applications", desc: "8-stage Kanban board for interview pipelines.", color: "#EC4899" },
    { step: "06", title: "Grow Your Career", desc: "Continuous milestones and on-chain credentialing.", color: "#10B981" }
  ];

  // Continuous Growth Journey
  const growthStages = [
    { stage: "Skills", desc: "Core Foundation", color: "#00D4FF" },
    { stage: "Projects", desc: "Practical Demos", color: "#38BDF8" },
    { stage: "Resume", desc: "ATS Aligned", color: "#6366F1" },
    { stage: "Jobs", desc: "Matching Feeds", color: "#A855F7" },
    { stage: "Applications", desc: "Tracked Funnel", color: "#EC4899" },
    { stage: "Career", desc: "Sustainable Income", color: "#10B981" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem", margin: "-2rem", overflowX: "hidden" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "4rem 2rem 4rem",
          overflow: "hidden"
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: "920px" }}>
          {/* Top Pill / Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.65rem",
              background: "linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(168, 85, 247, 0.2))",
              border: "1px solid rgba(0, 212, 255, 0.4)",
              backdropFilter: "blur(12px)",
              padding: "0.45rem 1.25rem",
              borderRadius: "9999px",
              marginBottom: "1.25rem",
              boxShadow: "0 0 25px rgba(0, 212, 255, 0.25)"
            }}
          >
            <Sparkles size={16} color="#00D4FF" />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #00D4FF, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.06em"
              }}
            >
              CONTINUOUS CAREER INTELLIGENCE
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.4rem)",
              fontWeight: 900,
              color: "#f8fafc",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              textShadow: "0 0 50px rgba(15, 76, 255, 0.4)"
            }}
          >
            Turn Your Skills Into <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF 0%, #38BDF8 25%, #818CF8 50%, #C084FC 75%, #F43F5E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.45))"
              }}
            >
              Real Opportunities.
            </span>
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              marginTop: "1.25rem",
              lineHeight: "1.6",
              maxWidth: "760px",
              margin: "1.25rem auto 0",
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)"
            }}
          >
            Build a stronger profile, discover verified jobs, identify skill gaps, prepare custom applications, and track your career journey in one unified portal.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "2.5rem",
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={() => onNavigateTab("career_jobs")}
              className="btn-primary"
              style={{
                padding: "0.95rem 2.4rem",
                fontSize: "1.05rem",
                background: "linear-gradient(135deg, #0F4CFF 0%, #00D4FF 50%, #A855F7 100%)",
                boxShadow: "0 0 35px rgba(0, 212, 255, 0.45)",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                border: "none",
                cursor: "pointer",
                borderRadius: "10px",
                fontWeight: 700,
                color: "#ffffff"
              }}
            >
              <Briefcase size={18} />
              <span>Explore Jobs</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onNavigateTab("career_profile")}
              className="btn-secondary"
              style={{
                padding: "0.95rem 2.4rem",
                fontSize: "1.05rem",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                cursor: "pointer",
                borderRadius: "10px",
                fontWeight: 700
              }}
            >
              <Award size={18} color="#00D4FF" />
              <span>Build My Profile</span>
            </button>
          </div>
        </div>

        {/* Feature quick cards */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "1240px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginTop: "4.5rem",
            padding: "0 1rem"
          }}
        >
          {featureCards.map((card) => {
            const IconComp = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigateTab(card.id)}
                className="glass-card"
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.65rem",
                  padding: "1.35rem",
                  border: `1px solid ${card.borderGlow}`,
                  background: "rgba(10, 15, 29, 0.75)",
                  backdropFilter: "blur(14px)",
                  borderRadius: "12px",
                  boxShadow: `0 8px 24px -6px ${card.borderGlow}`
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `${card.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: card.color,
                    border: `1px solid ${card.color}40`
                  }}
                >
                  <IconComp size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "0.04em" }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.25rem", lineHeight: "1.4" }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-Step Blueprint */}
      <section style={{ padding: "0 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #00D4FF, #A855F7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}
          >
            STEP-BY-STEP BLUEPRINT
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f8fafc", marginTop: "0.35rem" }}>
            How SkillToIncome Works
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: "0.35rem" }}>
            A structured path from college skill development to enterprise employment.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1rem" }}>
          {blueprintSteps.map((stepItem) => (
            <div
              key={stepItem.step}
              className="glass-panel"
              style={{
                padding: "1.5rem 1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                border: `1px solid ${stepItem.color}35`,
                background: "rgba(10, 15, 29, 0.8)",
                borderRadius: "12px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: `linear-gradient(90deg, ${stepItem.color}, transparent)`
                }}
              />
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: stepItem.color,
                  textShadow: `0 0 15px ${stepItem.color}66`
                }}
              >
                {stepItem.step}
              </div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f8fafc" }}>
                {stepItem.title}
              </h3>
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: "1.4" }}>
                {stepItem.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Career Telemetry */}
      <section style={{ padding: "0 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f8fafc" }}>
              Real-time Career Telemetry
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Personalized candidate analytics computed across your verified profile.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("career_dashboard")}
            className="btn-secondary"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            <span>Open Career Dashboard →</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div className="glass-panel" style={{ padding: "1.25rem", borderLeft: "4px solid #00D4FF", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Profile Strength</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#f8fafc", marginTop: "0.35rem" }}>85%</div>
            <div style={{ fontSize: "0.72rem", color: "#34d399", marginTop: "0.2rem" }}>Audit score: Strong</div>
          </div>
          <div className="glass-panel" style={{ padding: "1.25rem", borderLeft: "4px solid #6366F1", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Skill Match</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#f8fafc", marginTop: "0.35rem" }}>75%</div>
            <div style={{ fontSize: "0.72rem", color: "#38bdf8", marginTop: "0.2rem" }}>For Full Stack Engineer</div>
          </div>
          <div className="glass-panel" style={{ padding: "1.25rem", borderLeft: "4px solid #A855F7", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Resume Score</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#f8fafc", marginTop: "0.35rem" }}>82/100</div>
            <div style={{ fontSize: "0.72rem", color: "#c084fc", marginTop: "0.2rem" }}>5-factor ATS compliant</div>
          </div>
          <div className="glass-panel" style={{ padding: "1.25rem", borderLeft: "4px solid #10B981", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Job Matches</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#f8fafc", marginTop: "0.35rem" }}>{jobMatches.length} Active</div>
            <div style={{ fontSize: "0.72rem", color: "#34d399", marginTop: "0.2rem" }}>Verified public feeds</div>
          </div>
          <div className="glass-panel" style={{ padding: "1.25rem", borderLeft: "4px solid #F59E0B", borderRadius: "10px" }}>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Applications</div>
            <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#f8fafc", marginTop: "0.35rem" }}>{applications.length} Tracked</div>
            <div style={{ fontSize: "0.72rem", color: "#fbbf24", marginTop: "0.2rem" }}>1 Active Interview</div>
          </div>
        </div>
      </section>

      {/* Recently Synchronized Opportunities */}
      <section style={{ padding: "0 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f8fafc" }}>
              Recently Synchronized Opportunities
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
              Directly ingested from National Career Service (NCS) and Adzuna feeds.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab("career_jobs")}
            className="btn-primary"
            style={{
              padding: "0.6rem 1.25rem",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            <span>Search All Openings →</span>
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {jobMatches.slice(0, 3).map((rawMatch, index) => {
            // Robust normalization: works whether rawMatch is a flat job or nested { job, match_percentage }
            const job = rawMatch.job ? { ...rawMatch.job, ...rawMatch, id: rawMatch.job.id || rawMatch.id || rawMatch.job_id } : rawMatch;
            const uniqueKey = job.id || job.job_id || `rec-job-${index}`;
            const isSaved = savedJobIds.has(uniqueKey);

            return (
              <div
                key={uniqueKey}
                className="glass-panel"
                style={{
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "1rem",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "12px",
                  background: "rgba(10, 15, 29, 0.75)"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.74rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {job.source || "National Career Service"}
                    </span>
                    <button
                      onClick={() => handleToggleSaveJob(job)}
                      style={{ background: "none", border: "none", color: isSaved ? "#38bdf8" : "#64748b", cursor: "pointer" }}
                      title={isSaved ? "Saved" : "Save job"}
                    >
                      {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                    {job.title || "Software Engineer Opening"}
                  </h3>
                  <div style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: 600, marginTop: "0.2rem" }}>
                    {job.company || "Leading Employer"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#a78bfa", marginTop: "0.2rem" }}>
                    {job.location || "Maharashtra, India"} • {job.remoteType || "Hybrid"}
                  </div>
                  <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.5rem", lineHeight: "1.4" }}>
                    {job.description ? `${job.description.substring(0, 115)}...` : "Continuous matching job opening aligned with verified candidate skills."}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "0.75rem",
                    borderTop: "1px solid var(--border-subtle)"
                  }}
                >
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Updated {formatTimeAgo(job.updatedAt)}
                  </span>
                  <a
                    href={job.applicationUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary"
                    style={{
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.76rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      borderRadius: "6px",
                      textDecoration: "none"
                    }}
                  >
                    <span>Apply</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Student Career & Job Alerts Card */}
      <section style={{ padding: "0 2rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div
          className="glass-panel"
          style={{
            padding: "2rem",
            background: "linear-gradient(135deg, rgba(10, 15, 29, 0.95), rgba(15, 76, 255, 0.22), rgba(168, 85, 247, 0.15))",
            borderRadius: "14px",
            border: "1px solid rgba(0, 212, 255, 0.3)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  padding: "0.6rem",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Bell size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f8fafc" }}>
                  Student Career & Job Alerts
                </h2>
                <p style={{ color: "#94a3b8", fontSize: "0.86rem" }}>
                  Live reminders for new matching opportunities, interview deadlines, and profile tips.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("career_job_alerts")}
              className="btn-primary"
              style={{
                padding: "0.65rem 1.4rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.9rem"
              }}
            >
              <span>Configure Job Alerts</span>
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            <div style={{ background: "rgba(10, 15, 29, 0.6)", borderLeft: "3px solid #00D4FF", padding: "1rem", borderRadius: "0 8px 8px 0" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>🔔 New Frontend React Role</div>
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                Cognizant Hinjewadi matches 80% of your verified skills.
              </p>
            </div>
            <div style={{ background: "rgba(10, 15, 29, 0.6)", borderLeft: "3px solid #34D399", padding: "1rem", borderRadius: "0 8px 8px 0" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>🔔 Application Follow-up Due</div>
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                TCS Junior Full Stack Engineer application follow-up due in 3 days.
              </p>
            </div>
            <div style={{ background: "rgba(10, 15, 29, 0.6)", borderLeft: "3px solid #F59E0B", padding: "1rem", borderRadius: "0 8px 8px 0" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>🔔 Profile Improvement Tip</div>
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                Adding measurable outcomes to your projects will advance your profile strength to 92%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Trajectory & Growth Journey */}
      <section style={{ padding: "0 2rem 4rem", maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span
            style={{
              fontSize: "0.82rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #10B981, #00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}
          >
            CAREER TRAJECTORY
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800, color: "#f8fafc", marginTop: "0.35rem" }}>
            Your Continuous Growth Journey
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Skills → Projects → Resume → Jobs → Applications → Career
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", flexWrap: "wrap", gap: "1rem" }}>
          {growthStages.map((stageItem, index) => (
            <div
              key={stageItem.stage}
              style={{
                flex: "1 1 140px",
                background: "rgba(10, 15, 29, 0.8)",
                border: `1px solid ${stageItem.color}35`,
                borderRadius: "10px",
                padding: "1.25rem 0.85rem",
                textAlign: "center",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${stageItem.color}, #0F4CFF)`,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  margin: "0 auto 0.75rem",
                  boxShadow: `0 0 15px ${stageItem.color}66`
                }}
              >
                {index + 1}
              </div>
              <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.9rem" }}>{stageItem.stage}</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.2rem" }}>{stageItem.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
