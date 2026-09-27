export interface StudentUser {
  uid: string;
  email: string;
  displayName: string;
  education?: string;
  college?: string;
  skills?: string[];
  targetRole?: string;
  role: string;
}

export const defaultStudent: StudentUser = {
  uid: "usr-student-001",
  email: "aarav.deshmukh@coep.ac.in",
  displayName: "Aarav Deshmukh",
  education: "B.Tech in Computer Engineering",
  college: "COEP Technological University, Pune",
  skills: ["javascript", "react", "python", "sql", "html", "css"],
  targetRole: "full-stack-developer",
  role: "student"
};

const AUTH_STORAGE_KEY = 'skilltoincome_auth_user';

export const authService = {
  getCurrentUser: (): StudentUser => {
    if (typeof window === 'undefined') return defaultStudent;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Error reading stored user:", e);
    }
    return defaultStudent;
  },

  login: async (email: string, _password?: string): Promise<StudentUser> => {
    await new Promise(r => setTimeout(r, 400));
    const prefix = email.split('@')[0].replace(/[._-]/g, ' ');
    const displayName = prefix ? prefix.charAt(0).toUpperCase() + prefix.slice(1) : "Student Applicant";
    const user: StudentUser = {
      uid: "usr-" + Math.random().toString(36).substring(2, 9),
      email,
      displayName,
      education: "B.Tech in Computer Engineering",
      college: "COEP Technological University, Pune",
      skills: ["javascript", "react", "sql", "python", "html", "css"],
      targetRole: "full-stack-developer",
      role: "student"
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    return user;
  },

  register: async (data: Partial<StudentUser> & { fullName?: string; email: string }): Promise<StudentUser> => {
    await new Promise(r => setTimeout(r, 500));
    const user: StudentUser = {
      uid: "usr-" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      displayName: data.fullName || data.displayName || "Registered Student",
      education: data.education || "B.Tech in Computer Engineering",
      college: data.college || "COEP Technological University, Pune",
      skills: data.skills || ["javascript", "react", "python"],
      targetRole: data.targetRole || "full-stack-developer",
      role: "student"
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    return user;
  },

  loginWithGoogle: async (): Promise<StudentUser> => {
    await new Promise(r => setTimeout(r, 400));
    const user: StudentUser = {
      ...defaultStudent,
      uid: "usr-google-" + Date.now(),
      displayName: "Aarav Deshmukh (Google Verified)"
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    return user;
  },

  resetPassword: async (_email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    return true;
  },

  logout: async (): Promise<void> => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  }
};
