// Unified API Base URL for Full-Stack AI Studio App
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchWithRole(endpoint: string, role: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("X-Demo-Role", role);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Network error" }));
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  getSystemInfo: () =>
    fetch(`${API_BASE}/`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch system info");
      return r.json();
    }),
  
  getRolesPermissions: () =>
    fetch(`${API_BASE}/auth/roles-permissions`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch roles & permissions");
      return r.json();
    }),
  
  updatePermission: (role: string, permission: string, enabled: boolean, currentRole: string) =>
    fetchWithRole("/admin/permissions/update", currentRole, {
      method: "POST",
      body: JSON.stringify({ role, permission, enabled })
    }),
    
  getAuditLogs: (currentRole: string) => fetchWithRole("/admin/audit-logs", currentRole),
  
  getSkills: () =>
    fetch(`${API_BASE}/skills`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch skills");
      return r.json();
    }),
  
  getJobRoles: () =>
    fetch(`${API_BASE}/job-roles`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch job roles");
      return r.json();
    }),
  
  analyzeSkillGap: (studentSkills: any[], targetRoleId: string, currentRole: string) =>
    fetchWithRole("/skill-gap/analyze", currentRole, {
      method: "POST",
      body: JSON.stringify({ student_skills: studentSkills, target_role_id: targetRoleId })
    }),
    
  getRecommendedCourses: (skills: string[]) =>
    fetch(`${API_BASE}/recommendations/courses?skills=${encodeURIComponent(skills.join(","))}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch recommended courses");
      return r.json();
    }),
    
  getRecommendedProjects: (skills: string[]) =>
    fetch(`${API_BASE}/recommendations/projects?skills=${encodeURIComponent(skills.join(","))}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch recommended projects");
      return r.json();
    }),
    
  analyzeResume: async (formData: FormData) => {
    const response = await fetch(`${API_BASE}/resume/analyze`, {
      method: "POST",
      body: formData
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ detail: "Error analyzing resume" }));
      throw new Error(err.detail || "Error analyzing resume");
    }
    return response.json();
  },
  
  askCareerAssistant: (prompt: string, context?: any) =>
    fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context })
    }).then(r => {
      if (!r.ok) throw new Error("Failed to get response from AI assistant");
      return r.json();
    }),
    
  getIndustryJobs: () =>
    fetch(`${API_BASE}/industry/jobs`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch industry jobs");
      return r.json();
    }),
  
  createIndustryJob: (jobData: any, currentRole: string) =>
    fetchWithRole("/industry/jobs", currentRole, {
      method: "POST",
      body: JSON.stringify(jobData)
    }),
    
  searchCandidates: (roleId?: string) =>
    fetch(`${API_BASE}/industry/candidates${roleId ? `?role_id=${roleId}` : ""}`).then(r => {
      if (!r.ok) throw new Error("Failed to search candidates");
      return r.json();
    }),

  inviteCandidate: (inviteData: any, currentRole: string) =>
    fetchWithRole("/industry/invite", currentRole, {
      method: "POST",
      body: JSON.stringify(inviteData)
    }),
    
  getInstituteAnalytics: (currentRole: string) =>
    fetchWithRole("/institution/department-analytics", currentRole),
    
  submitCurriculum: (curriculum: any, currentRole: string) =>
    fetchWithRole("/institution/curriculum/submit", currentRole, {
      method: "POST",
      body: JSON.stringify(curriculum)
    }),
    
  getReviewerSubmissions: (currentRole: string) =>
    fetchWithRole("/reviewer/submissions", currentRole),
    
  actionReviewerSubmission: async (id: string, action: string, comment: string, currentRole: string) => {
    const formData = new FormData();
    formData.append("action", action);
    formData.append("comment", comment);
    const res = await fetch(`${API_BASE}/reviewer/submissions/${id}/action`, {
      method: "POST",
      headers: { "X-Demo-Role": currentRole },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Error processing review action" }));
      throw new Error(err.detail || "Error processing review action");
    }
    return res.json();
  },
  
  getDistrictDemand: (district?: string, skill?: string) =>
    fetch(`${API_BASE}/admin/district-demand?district=${district || "All"}&skill=${skill || "All"}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch district demand");
      return r.json();
    }),
    
  getAnomalies: (currentRole: string) =>
    fetchWithRole("/admin/anomalies", currentRole),
    
  verifyCredential: (hash: string) =>
    fetch(`${API_BASE}/verify-credential/${hash}`).then(r => {
      if (!r.ok) throw new Error("Failed to verify credential hash");
      return r.json();
    }),

  // ==========================================
  // Career Intelligence & Copilot Client SDK
  // ==========================================
  getJobs: (filters?: any) => {
    const params = new URLSearchParams();
    if (filters?.keyword) params.append('keyword', filters.keyword);
    if (filters?.location && filters.location !== 'All') params.append('location', filters.location);
    if (filters?.remote_type && filters.remote_type !== 'All') params.append('remote_type', filters.remote_type);
    if (filters?.job_type && filters.job_type !== 'All') params.append('job_type', filters.job_type);
    if (filters?.skill && filters.skill !== 'All') params.append('skill', filters.skill);
    return fetch(`${API_BASE}/jobs?${params.toString()}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch jobs");
      return r.json();
    });
  },

  getJobMatches: (userId = 'usr-default-student') =>
    fetch(`${API_BASE}/jobs/matches?user_id=${userId}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch job matches");
      return r.json();
    }),

  getJobById: (id: string) =>
    fetch(`${API_BASE}/jobs/${id}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch job details");
      return r.json();
    }),

  searchJobs: (criteria: any) =>
    fetch(`${API_BASE}/jobs/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(criteria)
    }).then(r => {
      if (!r.ok) throw new Error("Failed to search jobs");
      return r.json();
    }),

  saveJob: (job: any, userId = 'usr-default-student') =>
    fetch(`${API_BASE}/jobs/save?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job)
    }).then(r => r.json()),

  unsaveJob: (id: string) =>
    fetch(`${API_BASE}/jobs/save/${id}`, { method: "DELETE" }).then(r => r.json()),

  getCareerProfile: (userId = 'usr-default-student') =>
    fetch(`${API_BASE}/career/profile?user_id=${userId}`).then(r => {
      if (!r.ok) throw new Error("Failed to load career profile");
      return r.json();
    }),

  updateCareerProfile: (profile: any, userId = 'usr-default-student') =>
    fetch(`${API_BASE}/career/profile?user_id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    }).then(r => {
      if (!r.ok) throw new Error("Failed to update profile");
      return r.json();
    }),

  analyzeProfile: (profileText: string, userId = 'usr-default-student') =>
    fetch(`${API_BASE}/career/profile/analyze?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_text: profileText })
    }).then(r => {
      if (!r.ok) throw new Error("Failed to analyze profile");
      return r.json();
    }),

  prepareApplication: (jobId: string, userId = 'usr-default-student') =>
    fetch(`${API_BASE}/career/application/prepare?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: jobId })
    }).then(r => {
      if (!r.ok) throw new Error("Failed to prepare application");
      return r.json();
    }),

  getApplications: () =>
    fetch(`${API_BASE}/applications`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch applications");
      return r.json();
    }),

  createApplication: (appData: any) =>
    fetch(`${API_BASE}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appData)
    }).then(r => {
      if (!r.ok) throw new Error("Failed to record application");
      return r.json();
    }),

  updateApplication: (id: string, appData: any) =>
    fetch(`${API_BASE}/applications/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appData)
    }).then(r => {
      if (!r.ok) throw new Error("Failed to update application");
      return r.json();
    }),

  deleteApplication: (id: string) =>
    fetch(`${API_BASE}/applications/${id}`, { method: "DELETE" }).then(r => r.json()),

  getNotifications: () =>
    fetch(`${API_BASE}/notifications`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch notifications");
      return r.json();
    }),

  getNotificationPreferences: (userId = 'usr-default-student') =>
    fetch(`${API_BASE}/notifications/preferences?user_id=${userId}`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch notification preferences");
      return r.json();
    }),

  updateNotificationPreferences: (prefs: any, userId = 'usr-default-student') =>
    fetch(`${API_BASE}/notifications/preferences?user_id=${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs)
    }).then(r => {
      if (!r.ok) throw new Error("Failed to save preferences");
      return r.json();
    }),

  registerFcmToken: (token: string, userId = 'usr-default-student') =>
    fetch(`${API_BASE}/notifications/register-token?user_id=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    }).then(r => r.json()),

  getJobSyncStatus: () =>
    fetch(`${API_BASE}/system/job-sync-status`).then(r => {
      if (!r.ok) throw new Error("Failed to fetch sync status");
      return r.json();
    }),

  triggerJobSync: () =>
    fetch(`${API_BASE}/system/job-sync/trigger`, { method: "POST" }).then(r => {
      if (!r.ok) throw new Error("Failed to trigger sync");
      return r.json();
    })
};

// Client-side authentication helpers matching Vercel deployment
const DEFAULT_AUTH_USER = {
  uid: "usr-student-001",
  email: "aarav.deshmukh@coep.ac.in",
  displayName: "Aarav Deshmukh",
  education: "B.Tech in Computer Engineering",
  college: "COEP Technological University, Pune",
  skills: ["javascript", "react", "python", "sql", "html", "css"],
  targetRole: "full-stack-developer",
  role: "student"
};

const AUTH_STORAGE_KEY = "skilltoincome_auth_user";

export const authApi = {
  getCurrentUser: () => {
    if (typeof window === 'undefined') return DEFAULT_AUTH_USER;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading stored user:", e);
    }
    return DEFAULT_AUTH_USER;
  },

  login: async (email: string, password?: string) => {
    await new Promise(r => setTimeout(r, 400));
    const prefix = email.split('@')[0].replace('.', ' ');
    const displayName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const user = {
      uid: "usr-" + Math.random().toString(36).substring(2, 9),
      email,
      displayName: displayName || "Student Applicant",
      education: "B.Tech in Engineering",
      college: "Maharashtra Technical University",
      skills: ["javascript", "react", "sql", "python"],
      targetRole: "full-stack-developer",
      role: "student"
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  register: async (userData: any) => {
    await new Promise(r => setTimeout(r, 500));
    const user = {
      uid: "usr-" + Math.random().toString(36).substring(2, 9),
      email: userData.email,
      displayName: userData.fullName || "Student Applicant",
      education: userData.education || "B.Tech in Computer Engineering",
      college: userData.college || "COEP Technological University, Pune",
      skills: (userData.skills || "javascript, react, python, sql").split(',').map((s: string) => s.trim().toLowerCase()),
      targetRole: userData.targetRole || "full-stack-developer",
      role: "student"
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
};
