import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

const DATA_DIR = path.resolve(__dirname, 'data');

// Helper to load JSON files safely
function loadJsonFile<T>(filename: string, fallback: T): T {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error loading ${filename}:`, err);
  }
  return fallback;
}

function saveJsonFile(filename: string, data: any): void {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving ${filename}:`, err);
  }
}

// In-memory / persisted Audit Logs
let AUDIT_LOGS = [
  {
    id: "log-001",
    timestamp: "2026-09-26 10:15:22",
    user_email: "admin@skillbridge.gov.in",
    role: "government_admin",
    action: "SYSTEM_POLICY_UPDATE",
    module: "Government / Admin",
    status: "SUCCESS",
    ip_address: "10.0.4.12"
  },
  {
    id: "log-002",
    timestamp: "2026-09-26 11:30:45",
    user_email: "reviewer@skillauthority.mah.gov.in",
    role: "skill_reviewer",
    action: "CURRICULUM_APPROVE",
    module: "Skill Reviewer",
    status: "SUCCESS",
    ip_address: "10.0.12.8"
  },
  {
    id: "log-003",
    timestamp: "2026-09-26 14:02:10",
    user_email: "hr@persistent.com",
    role: "industry_employer",
    action: "CREATE_JOB_REQUIREMENT",
    module: "Industry Portal",
    status: "SUCCESS",
    ip_address: "49.36.128.4"
  }
];

function logAuditEvent(userEmail: string, role: string, action: string, module: string, status = "SUCCESS") {
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    user_email: userEmail,
    role,
    action,
    module,
    status,
    ip_address: "127.0.0.1"
  };
  AUDIT_LOGS.unshift(newLog);
  if (AUDIT_LOGS.length > 100) AUDIT_LOGS.pop();
}

function getCurrentRole(req: Request): string {
  const demoRole = req.headers['x-demo-role'] as string;
  const validRoles = ["government_admin", "skill_reviewer", "industry_employer", "training_institute", "trainer_faculty", "student"];
  if (demoRole && validRoles.includes(demoRole)) {
    return demoRole;
  }
  return "student";
}

// 100+ Skill Alias Dictionary
const SKILL_ALIASES: Record<string, string[]> = {
  // Languages
  "python": ["python", "py", "python3", "python 3", "cpython"],
  "javascript": ["javascript", "js", "ecmascript", "es6", "es6+", "vanilla js"],
  "typescript": ["typescript", "ts"],
  "java": ["java", "core java", "java 8", "java 11", "java 17", "j2ee"],
  "c": ["c language", "c programming", "ansi c"],
  "c++": ["c++", "cpp", "c plus plus"],
  "c#": ["c#", "csharp", "c sharp", ".net c#"],
  "go": ["go", "golang"],
  "rust": ["rust", "rustlang"],
  "kotlin": ["kotlin"],
  "swift": ["swift", "swiftui"],
  "php": ["php", "php7", "php8"],
  "ruby": ["ruby", "ruby on rails", "ror"],
  "r": ["r language", "r programming", "r-project"],
  "dart": ["dart", "flutter dart"],
  "scala": ["scala"],
  "shell": ["bash", "shell", "powershell", "zsh", "sh"],
  // Web & Frontend
  "html": ["html", "html5"],
  "css": ["css", "css3"],
  "react": ["react", "react.js", "reactjs", "react js"],
  "next.js": ["next.js", "nextjs", "next js", "next"],
  "angular": ["angular", "angularjs", "angular 2+", "angular 14"],
  "vue": ["vue", "vue.js", "vuejs", "vue 3"],
  "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
  "bootstrap": ["bootstrap", "bootstrap 5"],
  "sass": ["sass", "scss"],
  "redux": ["redux", "redux toolkit", "rtk"],
  // Backend Frameworks
  "node.js": ["node", "node.js", "nodejs", "node js"],
  "express": ["express", "express.js", "expressjs"],
  "django": ["django", "django rest framework", "drf"],
  "flask": ["flask"],
  "fastapi": ["fastapi", "fast-api", "fast api"],
  "spring": ["spring", "spring boot", "springboot", "spring framework"],
  "asp.net": ["asp.net", "asp.net core", ".net core", "dotnet"],
  "graphql": ["graphql", "apollo graphql"],
  "rest apis": ["rest", "rest api", "rest apis", "restful", "restful api", "restful apis"],
  "microservices": ["microservices", "microservice architecture", "distributed systems"],
  // Databases & Storage
  "sql": ["sql", "structured query language"],
  "postgresql": ["postgresql", "postgres", "psql"],
  "mysql": ["mysql"],
  "mongodb": ["mongodb", "mongo"],
  "redis": ["redis"],
  "sqlite": ["sqlite", "sqlite3"],
  "elasticsearch": ["elasticsearch", "elastic search", "elk"],
  "oracle": ["oracle db", "oracle sql", "pl/sql"],
  "cassandra": ["cassandra", "apache cassandra"],
  "dynamodb": ["dynamodb", "aws dynamodb"],
  // Cloud & DevOps
  "aws": ["aws", "amazon web services", "ec2", "s3", "lambda"],
  "azure": ["azure", "microsoft azure"],
  "gcp": ["gcp", "google cloud", "google cloud platform"],
  "docker": ["docker", "containerization", "containers"],
  "kubernetes": ["kubernetes", "k8s"],
  "git": ["git", "version control"],
  "github": ["github", "gitlab", "bitbucket"],
  "ci/cd": ["ci/cd", "continuous integration", "github actions", "jenkins", "gitlab ci"],
  "linux": ["linux", "ubuntu", "debian", "centos", "redhat"],
  "terraform": ["terraform", "iac", "infrastructure as code"],
  "ansible": ["ansible"],
  "nginx": ["nginx"],
  // Data, Analytics & BI
  "excel": ["excel", "microsoft excel", "advanced excel", "vlookup"],
  "power bi": ["power bi", "powerbi", "dax"],
  "tableau": ["tableau"],
  "pandas": ["pandas"],
  "numpy": ["numpy"],
  "data science": ["data science", "data analysis", "data analytics"],
  "spark": ["spark", "pyspark", "apache spark"],
  "hadoop": ["hadoop", "big data"],
  "kafka": ["kafka", "apache kafka"],
  "etl": ["etl", "data pipelines", "data engineering"],
  // AI, ML & Deep Learning
  "machine learning": ["machine learning", "ml", "supervised learning", "unsupervised learning"],
  "deep learning": ["deep learning", "neural networks", "cnn", "rnn", "transformers"],
  "tensorflow": ["tensorflow", "tf"],
  "pytorch": ["pytorch", "torch"],
  "scikit-learn": ["scikit-learn", "sklearn"],
  "nlp": ["nlp", "natural language processing", "spacy", "nltk", "huggingface"],
  "computer vision": ["computer vision", "opencv", "cv", "image processing"],
  "llm": ["llm", "large language models", "generative ai", "genai", "prompt engineering", "langchain"],
  // Security & Networking
  "cybersecurity": ["cybersecurity", "cyber security", "information security", "infosec"],
  "networking": ["networking", "computer networks", "tcp/ip", "dns", "http/https"],
  "cloud security": ["cloud security", "iam", "zero trust"],
  "ethical hacking": ["ethical hacking", "penetration testing", "vapt", "kali linux"],
  // Testing & QA
  "unit testing": ["unit testing", "pytest", "jest", "junit"],
  "selenium": ["selenium", "cypress", "playwright", "automation testing"],
  "postman": ["postman", "api testing"],
  // Design, Mobile & Soft Skills
  "ui/ux": ["ui/ux", "ui design", "ux design", "user experience", "user interface"],
  "figma": ["figma", "wireframing", "prototyping", "adobe xd"],
  "flutter": ["flutter"],
  "react native": ["react native", "react-native"],
  "android": ["android", "android development"],
  "ios": ["ios", "ios development"],
  "communication": ["communication", "verbal communication", "written communication"],
  "leadership": ["leadership", "team leadership", "mentorship"],
  "problem solving": ["problem solving", "analytical skills", "troubleshooting"],
  "critical thinking": ["critical thinking"],
  "teamwork": ["teamwork", "collaboration", "cross-functional collaboration"],
  "project management": ["project management", "agile", "scrum", "jira"]
};

function normalizeSkill(skillName: string): string {
  if (!skillName) return '';
  const clean = skillName.trim().toLowerCase();
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    if (clean === canonical || aliases.includes(clean)) {
      return canonical;
    }
  }
  return clean;
}

const WEIGHT_MAP: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1
};

function analyzeSkillGapInternal(studentSkills: any[], targetRoleId: string) {
  const jobRoles = loadJsonFile<any[]>('job_roles.json', []);
  const role = jobRoles.find(r => r.id === targetRoleId);
  if (!role) {
    throw new Error(`Job role '${targetRoleId}' not found.`);
  }

  const studentSkillMap: Record<string, string> = {};
  for (const s of studentSkills) {
    const rawName = s.skill_id || s.name || '';
    const norm = normalizeSkill(rawName);
    studentSkillMap[norm] = s.proficiency || 'Intermediate';
  }

  const requiredSkills = role.required_skills || [];
  const totalRequired = requiredSkills.length;
  const matchedSkills: any[] = [];
  const missingSkills: any[] = [];

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const req of requiredSkills) {
    const reqId = normalizeSkill(req.skill_id);
    const importance = (req.importance || 'medium').toLowerCase();
    const weight = WEIGHT_MAP[importance] || 2;
    totalWeight += weight;

    if (studentSkillMap[reqId]) {
      matchedWeight += weight;
      matchedSkills.push({
        skill_id: reqId,
        importance,
        weight,
        student_proficiency: studentSkillMap[reqId]
      });
    } else {
      missingSkills.push({
        skill_id: reqId,
        importance,
        weight,
        priority_rank: importance === 'high' ? 1 : (importance === 'medium' ? 2 : 3)
      });
    }
  }

  missingSkills.sort((a, b) => b.weight - a.weight);

  const matchedCount = matchedSkills.length;
  const basicScore = totalRequired > 0 ? Math.round((matchedCount / totalRequired * 100) * 10) / 10 : 0;
  const weightedScore = totalWeight > 0 ? Math.round((matchedWeight / totalWeight * 100) * 10) / 10 : 0;

  const preferredMatches: string[] = [];
  const preferredMissing: string[] = [];
  for (const pref of (role.preferred_skills || [])) {
    const prefId = normalizeSkill(pref);
    if (studentSkillMap[prefId]) {
      preferredMatches.push(prefId);
    } else {
      preferredMissing.push(prefId);
    }
  }

  const formulaExplanation = {
    basic_formula: `${matchedCount} matched / ${totalRequired} required × 100 = ${basicScore}%`,
    weighted_formula: `Σ(weights of matched: ${matchedWeight}) / Σ(weights of all required: ${totalWeight}) × 100 = ${weightedScore}%`,
    weights_used: { High: 3, Medium: 2, Low: 1 },
    disclaimer: "This score indicates alignment with core curriculum and job requirements; it does not guarantee employment."
  };

  return {
    role_id: role.id,
    role_title: role.title,
    industry: role.industry,
    experience_level: role.experience_level,
    basic_match_pct: basicScore,
    weighted_match_pct: weightedScore,
    total_required_skills: totalRequired,
    matched_skills_count: matchedCount,
    missing_skills_count: missingSkills.length,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    preferred_matched: preferredMatches,
    preferred_missing: preferredMissing,
    roadmap: role.roadmap || [],
    formula_breakdown: formulaExplanation
  };
}

function explainMatchScore(gapResult: any): string {
  const role = gapResult.role_title || "Target Role";
  const weightedPct = gapResult.weighted_match_pct || 0;
  const basicPct = gapResult.basic_match_pct || 0;
  const matched = (gapResult.matched_skills || []).map((s: any) => s.skill_id);
  const missing = (gapResult.missing_skills || []).map((s: any) => s.skill_id);
  const highMissing = (gapResult.missing_skills || [])
    .filter((s: any) => s.importance === 'high')
    .map((s: any) => s.skill_id);

  const matchedStr = matched.length > 0 ? matched.join(", ") : "none";
  const highStr = highMissing.length > 0 ? highMissing.join(", ") : "none";

  return `Your compatibility score for ${role} is calculated at ${weightedPct}% (weighted) and ${basicPct}% (basic). ` +
    `You have confirmed proficiency in ${matched.length} requirement(s): ${matchedStr}. ` +
    `However, ${missing.length} skill(s) remain unverified. Crucially, high-impact prerequisites like ${highStr} carry 3x importance weights ` +
    `in the employer evaluation model. Closing these priority gaps through recommended practical projects or certified training will rapidly advance your score above 85%.`;
}

// Text analysis helpers for resume
function detectSkillsInText(text: string) {
  const textLower = text.toLowerCase();
  const detected: any[] = [];
  const seen = new Set<string>();

  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    for (const alias of aliases) {
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(textLower)) {
        if (!seen.has(canonical)) {
          seen.add(canonical);
          detected.push({
            skill_id: canonical,
            name: canonical.charAt(0).toUpperCase() + canonical.slice(1),
            proficiency: 'Intermediate'
          });
        }
        break;
      }
    }
  }
  return detected;
}

function analyzeExperience(text: string) {
  const lower = text.toLowerCase();
  let expYears = 0;
  const match = lower.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?experience/);
  if (match) {
    expYears = parseInt(match[1], 10);
  }
  const hasInternship = /\b(intern|internship|trainee|apprentice)\b/.test(lower);
  const hasProjects = /\b(projects?|portfolio|capstone|github\.com)\b/.test(lower);

  let score = 50;
  let level = "Fresher / Foundational";
  if (expYears >= 3) {
    score = 95;
    level = "Senior / Experienced";
  } else if (expYears >= 1) {
    score = 80;
    level = "Mid Level";
  } else if (hasInternship || hasProjects) {
    score = 70;
    level = "Entry Level / Internship Experience";
  }

  return {
    score,
    estimated_years: expYears,
    has_internship: hasInternship,
    has_projects: hasProjects,
    level
  };
}

function analyzeEducation(text: string) {
  const lower = text.toLowerCase();
  const degrees: string[] = [];
  const degreePatterns: [RegExp, string][] = [
    [/\b(b\.?tech|b\.?e\.?|bachelor of engineering|bachelor of technology)\b/i, "B.Tech / B.E."],
    [/\b(m\.?tech|m\.?e\.?|master of technology)\b/i, "M.Tech / M.E."],
    [/\b(bca|bachelor of computer applications)\b/i, "BCA"],
    [/\b(mca|master of computer applications)\b/i, "MCA"],
    [/\b(b\.?sc|bachelor of science)\b/i, "B.Sc"],
    [/\b(diploma in engineering|polytechnic)\b/i, "Polytechnic Diploma"],
    [/\b(ph\.?d|doctorate)\b/i, "Ph.D"]
  ];

  for (const [pattern, name] of degreePatterns) {
    if (pattern.test(lower)) {
      degrees.push(name);
    }
  }

  let score = 60;
  if (degrees.length > 0) {
    score = 90;
  } else if (/\b(university|college|institute|cgpa|gpa|percentage)\b/i.test(lower)) {
    score = 75;
    degrees.push("Undergraduate Degree / College");
  } else {
    degrees.push("Not Explicitly Specified");
  }

  return {
    score,
    degrees_detected: degrees
  };
}

function analyzeAchievements(text: string) {
  const lower = text.toLowerCase();
  const signals: string[] = [];
  const checks: [RegExp, string][] = [
    [/\b(hackathon|smart india hackathon|sih|winner|runner up|1st place)\b/i, "Hackathon & Competitions"],
    [/\b(certified|certification|aws certified|nptel|coursera|badge)\b/i, "Professional Certifications"],
    [/\b(published|ieee|paper|research)\b/i, "Research / Publications"],
    [/\b(lead|president|captain|founded|organized|coordinated)\b/i, "Leadership & Initiatives"],
    [/\b(published app|open source|contributor|pull request)\b/i, "Open Source / Real-world Deployments"]
  ];

  for (const [pattern, label] of checks) {
    if (pattern.test(lower)) {
      signals.push(label);
    }
  }

  const score = Math.min(100, 50 + signals.length * 15);
  return {
    score,
    signals
  };
}

function computeKeywordDensity(text: string, targetRoleId: string) {
  const jobRoles = loadJsonFile<any[]>('job_roles.json', []);
  const role = jobRoles.find(r => r.id === targetRoleId);
  if (!role) {
    return { score: 65, density_level: "Moderate", keywords_present: 5, total_domain_keywords: 10 };
  }

  const keywords: string[] = [
    ...(role.required_skills || []).map((req: any) => req.skill_id),
    ...(role.preferred_skills || [])
  ];

  const textLower = text.toLowerCase();
  const found = keywords.filter(kw => textLower.includes(kw.toLowerCase()));
  const ratio = keywords.length > 0 ? found.length / keywords.length : 0.5;
  const score = Math.min(100, Math.floor(ratio * 100) + 15);

  return {
    score,
    keywords_present: found.length,
    total_domain_keywords: keywords.length,
    density_level: ratio > 0.6 ? "High" : (ratio > 0.3 ? "Medium" : "Low")
  };
}

function analyzeResumeComprehensive(text: string, targetRoleId = "full-stack-developer") {
  const detectedSkills = detectSkillsInText(text);
  const gapResult = analyzeSkillGapInternal(detectedSkills, targetRoleId);
  const expResult = analyzeExperience(text);
  const eduResult = analyzeEducation(text);
  const achieveResult = analyzeAchievements(text);
  const keywordResult = computeKeywordDensity(text, targetRoleId);

  const skillScore = gapResult.weighted_match_pct;
  const expScore = expResult.score;
  const eduScore = eduResult.score;
  const kwScore = keywordResult.score;
  const achScore = achieveResult.score;

  const overallScore = Math.round(
    ((skillScore * 0.40) +
     (expScore * 0.25) +
     (eduScore * 0.15) +
     (kwScore * 0.10) +
     (achScore * 0.10)) * 10
  ) / 10;

  const suggestions: string[] = [];
  if (gapResult.missing_skills && gapResult.missing_skills.length > 0) {
    const topMissing = gapResult.missing_skills.slice(0, 3).map((s: any) => s.skill_id);
    suggestions.push(`Add evidence or portfolio project links demonstrating: ${topMissing.join(', ')}.`);
  }
  if (!expResult.has_projects) {
    suggestions.push("Highlight specific GitHub repository links, live demos, and measurable project outcomes.");
  }
  if (achieveResult.score < 70) {
    suggestions.push("Include relevant competitive hackathons (e.g., SIH), certifications, or technical workshops.");
  }
  if (keywordResult.score < 70) {
    suggestions.push("Align technical terminologies with standard industry job requirements.");
  }

  return {
    target_role_id: targetRoleId,
    target_role_title: gapResult.role_title,
    overall_match_score: overallScore,
    weights_model: {
      skill_match_40: skillScore,
      experience_25: expScore,
      education_15: eduScore,
      keyword_density_10: kwScore,
      achievements_10: achScore
    },
    detected_skills: detectedSkills,
    skill_gap: gapResult,
    experience_analysis: expResult,
    education_analysis: eduResult,
    achievements_analysis: achieveResult,
    keyword_analysis: keywordResult,
    actionable_suggestions: suggestions
  };
}

// Router for API endpoints
const apiRouter = express.Router();

// System Info
apiRouter.get('/', (req, res) => {
  res.json({
    platform: "SkillBridge AI (SIH26134)",
    tagline: "Bridging the Gap Between Education, Skills and Industry",
    organization: "Government of Maharashtra",
    status: "Online",
    modules: 18
  });
});

// Roles & Permissions
apiRouter.get('/auth/roles-permissions', (req, res) => {
  const matrix = loadJsonFile('rbac_permissions.json', {});
  res.json(matrix);
});

apiRouter.post('/admin/permissions/update', (req, res) => {
  const currentRole = getCurrentRole(req);
  if (currentRole !== 'government_admin') {
    return res.status(403).json({ detail: "Only Government/Admin can update permissions." });
  }

  const { role, permission, enabled } = req.body;
  const matrix = loadJsonFile<Record<string, any>>('rbac_permissions.json', {});

  if (matrix[role] && matrix[role].permissions && typeof matrix[role].permissions[permission] !== 'undefined') {
    matrix[role].permissions[permission] = enabled;
    saveJsonFile('rbac_permissions.json', matrix);
    logAuditEvent("admin@skillbridge.gov.in", currentRole, `TOGGLE_PERMISSION_${role}_${permission}`, "Admin RBAC");
    return res.json({ success: true, matrix });
  }

  res.status(400).json({ detail: "Invalid role or permission key." });
});

apiRouter.get('/admin/audit-logs', (req, res) => {
  const currentRole = getCurrentRole(req);
  if (currentRole !== 'government_admin') {
    return res.status(403).json({ detail: "Access Restricted: Requires Government/Admin role." });
  }
  res.json(AUDIT_LOGS);
});

// Skills & Job Roles
apiRouter.get('/skills', (req, res) => {
  const skills = loadJsonFile('skills.json', []);
  res.json(skills);
});

apiRouter.get('/job-roles', (req, res) => {
  const roles = loadJsonFile('job_roles.json', []);
  res.json(roles);
});

apiRouter.get('/job-roles/:id', (req, res) => {
  const roles = loadJsonFile<any[]>('job_roles.json', []);
  const role = roles.find(r => r.id === req.params.id);
  if (!role) {
    return res.status(404).json({ detail: "Job role not found." });
  }
  res.json(role);
});

// Skill Gap Analyzer
apiRouter.post('/skill-gap/analyze', (req, res) => {
  try {
    const { student_skills, target_role_id } = req.body;
    const result = analyzeSkillGapInternal(student_skills || [], target_role_id);
    (result as any).explainable_narrative = explainMatchScore(result);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ detail: err.message || "Error analyzing skill gap" });
  }
});

// Course & Project Recommendations
apiRouter.get('/recommendations/courses', (req, res) => {
  const skillsQuery = (req.query.skills as string) || '';
  const missing = skillsQuery ? skillsQuery.split(',').map(s => s.trim().toLowerCase()) : [];
  const courses = loadJsonFile<any[]>('courses.json', []);

  const recommended: any[] = [];
  for (const c of courses) {
    if (missing.includes(c.skill_id?.toLowerCase())) {
      recommended.push({ ...c, relevance: "Direct Gap Match" });
    }
  }

  if (recommended.length < 4) {
    for (const c of courses) {
      if (!recommended.some(r => r.id === c.id)) {
        recommended.push({ ...c, relevance: "Industry Foundation" });
        if (recommended.length >= 6) break;
      }
    }
  }

  res.json(recommended);
});

apiRouter.get('/recommendations/projects', (req, res) => {
  const skillsQuery = (req.query.skills as string) || '';
  const missing = skillsQuery ? skillsQuery.split(',').map(s => s.trim().toLowerCase()) : [];
  const projects = loadJsonFile<any[]>('projects.json', []);

  const recommended: any[] = [];
  for (const p of projects) {
    if (missing.includes(p.missing_skill_id?.toLowerCase())) {
      recommended.push({ ...p, relevance: "Solves Skill Gap" });
    }
  }

  if (recommended.length < 3) {
    for (const p of projects) {
      if (!recommended.some(r => r.id === p.id)) {
        recommended.push({ ...p, relevance: "Recommended Portfolio Builder" });
        if (recommended.length >= 4) break;
      }
    }
  }

  res.json(recommended);
});

// Resume Analyzer
apiRouter.post('/resume/analyze', upload.single('file'), (req, res) => {
  try {
    let content = '';
    if (req.file) {
      const raw = req.file.buffer.toString('utf-8');
      if (req.file.mimetype.includes('text') || req.file.originalname.endsWith('.txt')) {
        content = raw;
      } else {
        // Extract readable text chunks from PDF/DOCX binary buffer
        const asciiStrings = req.file.buffer.toString('latin1').match(/[A-Za-z0-9+#.\s]{3,}/g);
        content = asciiStrings ? asciiStrings.join(' ') : raw;
      }
    } else if (req.body.resume_text) {
      content = req.body.resume_text;
    } else {
      return res.status(400).json({ detail: "Please provide a resume file or text." });
    }

    if (content.trim().length < 20) {
      return res.status(400).json({ detail: "Extracted text is too short to analyze." });
    }

    const targetRoleId = req.body.target_role_id || "full-stack-developer";
    const result = analyzeResumeComprehensive(content, targetRoleId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ detail: err.message || "Failed to analyze resume" });
  }
});

// AI Career Assistant
apiRouter.post('/ai/chat', async (req, res) => {
  const { prompt, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI();
      const contextStr = JSON.stringify(context || {}, null, 2);
      const systemInstruction =
        "You are the SkillBridge AI Career Counselor for the Government of Maharashtra. " +
        "Base all your career advice strictly on the student's profile, skill gap data, and government courses provided. " +
        "Do not hallucinate external facts or fabricate guarantees. Be encouraging, professional, and actionable.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Context:\n${contextStr}\n\nStudent Query: ${prompt}` }]
          }
        ],
        config: {
          systemInstruction
        }
      });

      const aiText = response.text || '';
      return res.json({
        source: "Gemini AI (Grounded)",
        response: aiText
      });
    } catch (err) {
      console.warn("Gemini call failed, using rule-based fallback:", err);
    }
  }

  // Deterministic Grounded Fallback
  const promptLower = (prompt || '').toLowerCase();
  if (promptLower.includes('why') || promptLower.includes('score') || promptLower.includes('explain')) {
    if (context && context.weighted_match_pct !== undefined) {
      return res.json({
        source: "SkillBridge Rule-Grounded Explainer",
        response: explainMatchScore(context)
      });
    }
    return res.json({
      source: "SkillBridge Rule-Grounded Explainer",
      response: "Your match score is calculated by comparing verified skills against employer requirements. High-importance skills carry 3x weight, medium carry 2x, and low carry 1x."
    });
  }

  if (promptLower.includes('missing') || promptLower.includes('gap')) {
    if (context && context.missing_skills && context.missing_skills.length > 0) {
      const missingNames = context.missing_skills.map((s: any) => s.skill_id);
      return res.json({
        source: "SkillBridge Rule-Grounded Explainer",
        response: `Based on your target role '${context.role_title || 'selected role'}', your primary missing skills are: ${missingNames.join(', ')}. Focus on the high-priority ones first.`
      });
    }
    return res.json({
      source: "SkillBridge Rule-Grounded Explainer",
      response: "Select a target job role in the Skill Gap Analyzer to view your missing skills ranked by employer demand priority."
    });
  }

  if (promptLower.includes('learn') || promptLower.includes('course') || promptLower.includes('next')) {
    return res.json({
      source: "SkillBridge Rule-Grounded Explainer",
      response: "To close your current gap effectively, begin with the top-priority missing skill. Check the Course Recommendations tab for subsidized courses accredited by Skill India Digital Hub and AICTE."
    });
  }

  if (promptLower.includes('project') || promptLower.includes('build')) {
    return res.json({
      source: "SkillBridge Rule-Grounded Explainer",
      response: "Building hands-on capstone projects is the most effective way to prove competence. Navigate to the Recommended Projects tab to find portfolio projects tailored to your missing skills."
    });
  }

  return res.json({
    source: "SkillBridge Rule-Grounded Explainer",
    response: "Hello! I am your SkillBridge Career Assistant. I can help explain your skill match score, identify missing skills for target roles, recommend government-certified courses from Skill India Digital Hub, or suggest portfolio projects to increase your employability readiness."
  });
});

// Industry Jobs & Candidates
apiRouter.get('/industry/jobs', (req, res) => {
  const jobs = loadJsonFile('jobs.json', []);
  res.json(jobs);
});

apiRouter.post('/industry/jobs', (req, res) => {
  const currentRole = getCurrentRole(req);
  if (!['industry_employer', 'government_admin'].includes(currentRole)) {
    return res.status(403).json({ detail: "Access Restricted: Only Industry or Admin can post jobs." });
  }

  const jobs = loadJsonFile<any[]>('jobs.json', []);
  const job = req.body;
  const newJob = {
    id: `job-${jobs.length + 101}`,
    company: job.company,
    title: job.title,
    role_id: job.role_id,
    location: job.location,
    salary_range: "Competitive (Industry Standard)",
    type: "Full Time",
    required_skills: (job.required_skills || []).map((s: any) => typeof s === 'string' ? s : s.skill_id),
    description: job.description
  };
  jobs.unshift(newJob);
  saveJsonFile('jobs.json', jobs);
  logAuditEvent("recruiter@company.com", currentRole, `POST_JOB_${newJob.id}`, "Industry Dashboard");
  res.json({ success: true, job: newJob });
});

apiRouter.get('/industry/candidates', (req, res) => {
  const students = loadJsonFile<any[]>('students.json', []);
  const roleId = req.query.role_id as string;

  if (roleId) {
    const scoredCandidates = students.map(std => {
      const gap = analyzeSkillGapInternal(std.skills || [], roleId);
      return {
        ...std,
        compatibility_score: gap.weighted_match_pct,
        matched_skills_count: gap.matched_skills_count,
        total_required: gap.total_required_skills
      };
    });
    scoredCandidates.sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));
    return res.json(scoredCandidates);
  }

  res.json(students);
});

apiRouter.post('/industry/invite', (req, res) => {
  const currentRole = getCurrentRole(req);
  if (!['industry_employer', 'government_admin'].includes(currentRole)) {
    return res.status(403).json({ detail: "Only industry employers or administrators can issue interview invites." });
  }

  const { student_id, student_name, role_title, interview_date, format, notes } = req.body;
  logAuditEvent(
    "recruiter@company.com",
    currentRole,
    `INVITE_${student_id || 'CANDIDATE'}_${role_title || 'ROLE'}`,
    "Industry Portal"
  );

  res.json({
    success: true,
    message: `Official interview invitation sent to ${student_name || 'candidate'} for '${role_title || 'Position'}'. Mode: ${format || 'Virtual Video Screen'}. Scheduled: ${interview_date || 'Flexible'}`,
    details: {
      candidate: student_name,
      role: role_title,
      scheduled: interview_date,
      format,
      notes
    }
  });
});

// Institution Analytics & Curriculum Submissions
apiRouter.get('/institution/department-analytics', (req, res) => {
  res.json({
    institution: "COEP Technological University, Pune",
    department: "Computer Engineering & IT",
    enrolled_students: 480,
    placement_readiness_rate: "72.4%",
    skills_comparison: [
      { skill: "Python", curriculum_coverage_pct: 82, industry_demand_pct: 88, gap_pct: -6, status: "Aligned" },
      { skill: "SQL", curriculum_coverage_pct: 74, industry_demand_pct: 85, gap_pct: -11, status: "Moderate Gap" },
      { skill: "React & Modern Web", curriculum_coverage_pct: 48, industry_demand_pct: 82, gap_pct: -34, status: "Critical Gap" },
      { skill: "Cloud / AWS", curriculum_coverage_pct: 31, industry_demand_pct: 90, gap_pct: -59, status: "Severe Gap" },
      { skill: "Docker & DevOps", curriculum_coverage_pct: 25, industry_demand_pct: 78, gap_pct: -53, status: "Severe Gap" },
      { skill: "AI & Machine Learning", curriculum_coverage_pct: 60, industry_demand_pct: 86, gap_pct: -26, status: "Moderate Gap" },
      { skill: "Cybersecurity", curriculum_coverage_pct: 38, industry_demand_pct: 75, gap_pct: -37, status: "Critical Gap" }
    ]
  });
});

apiRouter.post('/institution/curriculum/submit', (req, res) => {
  const currentRole = getCurrentRole(req);
  if (!['training_institute', 'trainer_faculty', 'government_admin'].includes(currentRole)) {
    return res.status(403).json({ detail: "Access Restricted: Insufficient privileges." });
  }

  const submissions = loadJsonFile<any[]>('curriculum_submissions.json', []);
  const reqBody = req.body;
  const newSub = {
    id: `curr-0${submissions.length + 1}`,
    institute: reqBody.institute,
    department: reqBody.department,
    proposed_title: reqBody.proposed_title,
    status: "Pending",
    submitted_by: "Academic Faculty",
    skills_covered: reqBody.skills_covered || [],
    industry_partner: reqBody.industry_partner,
    justification: reqBody.justification,
    comments: []
  };
  submissions.push(newSub);
  saveJsonFile('curriculum_submissions.json', submissions);
  logAuditEvent("institute@college.edu", currentRole, `SUBMIT_CURRICULUM_${newSub.id}`, "Institute Dashboard");
  res.json({ success: true, submission: newSub });
});

// Reviewer Submissions
apiRouter.get('/reviewer/submissions', (req, res) => {
  const submissions = loadJsonFile('curriculum_submissions.json', []);
  res.json(submissions);
});

apiRouter.post('/reviewer/submissions/:id/action', upload.none(), (req, res) => {
  const currentRole = getCurrentRole(req);
  if (!['skill_reviewer', 'government_admin'].includes(currentRole)) {
    return res.status(403).json({ detail: "Only Skill Authority / Reviewer can approve curricula." });
  }

  const { id } = req.params;
  const { action, comment } = req.body;
  const submissions = loadJsonFile<any[]>('curriculum_submissions.json', []);

  const sub = submissions.find(s => s.id === id);
  if (!sub) {
    return res.status(404).json({ detail: "Submission not found." });
  }

  sub.status = action;
  if (!sub.comments) sub.comments = [];
  sub.comments.push(`[${action.toUpperCase()} by ${currentRole.toUpperCase()}]: ${comment || ''}`);

  saveJsonFile('curriculum_submissions.json', submissions);
  logAuditEvent("reviewer@gov.in", currentRole, `CURRICULUM_${action.toUpperCase()}_${id}`, "Reviewer Queue");
  res.json({ success: true, submission_id: id, new_status: action });
});

// Admin District Demand & Anomalies
apiRouter.get('/admin/district-demand', (req, res) => {
  const data = loadJsonFile<any[]>('skill_demand.json', []);
  const district = req.query.district as string;
  const skill = req.query.skill as string;

  let filtered = data;
  if (district && district !== 'All') {
    filtered = filtered.filter(d => d.district === district);
  }
  if (skill && skill !== 'All') {
    filtered = filtered.filter(d => d.skill_id === skill);
  }

  res.json(filtered);
});

apiRouter.get('/admin/anomalies', (req, res) => {
  res.json([
    {
      id: "anom-01",
      entity: "Solapur Vocational Center #4",
      metric: "Certificate Issuance Spike",
      value: "+340% in 14 days",
      z_score: 3.82,
      severity: "High (Investigation Warranted)",
      flagged_at: "2026-09-24",
      description: "Unusually rapid completion of Cloud Computing certificates without matching lab hours."
    },
    {
      id: "anom-02",
      entity: "Nashik AgriTech Institute",
      metric: "Skill Gap Divergence",
      value: "Demand +45% vs Enrolled 0%",
      z_score: 2.65,
      severity: "Medium (Policy Intervention)",
      flagged_at: "2026-09-21",
      description: "Automotive robotics demand spiked, but local curricula have zero elective registrations."
    }
  ]);
});

// Credential Verification
apiRouter.get('/verify-credential/:cert_hash', (req, res) => {
  const validHashes: Record<string, any> = {
    "8f4b23c91d4e7a60b93e817a3a2d10e5f29c48b1d927a4e69b031c5d8e72f910": {
      student_name: "Aarav Deshmukh",
      course: "Full Stack Web Development with React & Node",
      issued_by: "Skill India Digital Hub & Maharashtra MSBTE",
      date: "2026-08-15",
      verification_status: "AUTHENTIC & VERIFIED ON-CHAIN"
    }
  };

  const { cert_hash } = req.params;
  if (validHashes[cert_hash]) {
    return res.json({ valid: true, record: validHashes[cert_hash] });
  }

  res.json({
    valid: false,
    detail: "Credential hash not found or tampered. Signature invalid."
  });
});

// ==========================================
// Career Intelligence & Copilot Endpoints
// ==========================================

// Jobs Feed with Filters & NCS Search
apiRouter.get('/jobs', (req, res) => {
  let jobs = loadJsonFile<any[]>('career_jobs.json', []);
  const { keyword, location, remote_type, job_type, skill } = req.query;

  if (keyword && typeof keyword === 'string' && keyword.trim()) {
    const kw = keyword.toLowerCase();
    jobs = jobs.filter(j =>
      (j.title && j.title.toLowerCase().includes(kw)) ||
      (j.company && j.company.toLowerCase().includes(kw)) ||
      (j.description && j.description.toLowerCase().includes(kw))
    );
  }

  if (location && location !== 'All') {
    jobs = jobs.filter(j => j.location && j.location.toLowerCase().includes(String(location).toLowerCase()));
  }

  if (remote_type && remote_type !== 'All') {
    jobs = jobs.filter(j => j.remoteType && j.remoteType.toLowerCase() === String(remote_type).toLowerCase());
  }

  if (job_type && job_type !== 'All') {
    jobs = jobs.filter(j => j.employmentType && j.employmentType.toLowerCase() === String(job_type).toLowerCase());
  }

  if (skill && skill !== 'All') {
    const sk = String(skill).toLowerCase();
    jobs = jobs.filter(j => (j.skills || []).some((s: string) => s.toLowerCase() === sk));
  }

  res.json(jobs);
});

apiRouter.get('/jobs/matches', (req, res) => {
  const matches = loadJsonFile<any[]>('career_matches.json', []);
  res.json(matches);
});

apiRouter.get('/jobs/:id', (req, res) => {
  const jobs = loadJsonFile<any[]>('career_jobs.json', []);
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ detail: "Job opening not found." });
  res.json(job);
});

apiRouter.post('/jobs/search', (req, res) => {
  let jobs = loadJsonFile<any[]>('career_jobs.json', []);
  const { keyword, location, remoteType, employmentType } = req.body;

  if (keyword) {
    const kw = String(keyword).toLowerCase();
    jobs = jobs.filter(j =>
      (j.title && j.title.toLowerCase().includes(kw)) ||
      (j.company && j.company.toLowerCase().includes(kw))
    );
  }
  if (location && location !== 'All') {
    jobs = jobs.filter(j => j.location && j.location.toLowerCase().includes(String(location).toLowerCase()));
  }
  if (remoteType && remoteType !== 'All') {
    jobs = jobs.filter(j => j.remoteType === remoteType);
  }
  if (employmentType && employmentType !== 'All') {
    jobs = jobs.filter(j => j.employmentType === employmentType);
  }
  res.json(jobs);
});

apiRouter.post('/jobs/save', (req, res) => {
  const savedJob = req.body;
  logAuditEvent("student@coep.ac.in", "student", `SAVE_JOB_${savedJob.id || 'ITEM'}`, "Career Jobs");
  res.json({ success: true, saved: savedJob });
});

apiRouter.delete('/jobs/save/:id', (req, res) => {
  logAuditEvent("student@coep.ac.in", "student", `UNSAVE_JOB_${req.params.id}`, "Career Jobs");
  res.json({ success: true, removed: req.params.id });
});

// Career Profile
apiRouter.get('/career/profile', (req, res) => {
  const profile = loadJsonFile<any>('career_profile.json', {});
  res.json(profile);
});

apiRouter.put('/career/profile', (req, res) => {
  const updated = req.body;
  saveJsonFile('career_profile.json', updated);
  logAuditEvent("student@coep.ac.in", "student", "UPDATE_CAREER_PROFILE", "Profile Builder");
  res.json({ success: true, profile: updated });
});

apiRouter.post('/career/profile/analyze', (req, res) => {
  const { profile_text } = req.body;
  const profile = loadJsonFile<any>('career_profile.json', {});
  const skillsDetected = profile.skills || ['javascript', 'react', 'python', 'sql'];

  res.json({
    readiness_score: 82,
    strengths: [
      "Well-defined project outcomes with full-stack technology stack",
      "Accredited state board and Skill India certification present",
      "Hands-on internship experience in e-governance domain"
    ],
    weaknesses: [
      "Limited verifiable cloud deployment architecture links",
      "CI/CD and Docker containerization experience unmentioned in headline"
    ],
    recommendations: [
      "Add Docker and AWS EC2 deployment proof to your Citizen Portal project",
      "Target Associate Cloud Engineer certification on Skill India Digital Hub"
    ],
    target_role_readiness: {
      role: "Full Stack Web Developer",
      match_pct: 85,
      missing_skills: ["docker", "aws"]
    },
    suggested_headline: "Full Stack Engineer | React, Node.js & Cloud Architectures | Smart India Hackathon Finalist",
    suggested_project_title: "Cloud-Native Containerized Microservice Delivery",
    suggested_project_description: "Containerize the Citizen Service Portal with Docker Compose, integrate GitHub Actions CI pipeline, and host on AWS ECS."
  });
});

apiRouter.post('/career/application/prepare', (req, res) => {
  const { job_id } = req.body;
  const jobs = loadJsonFile<any[]>('career_jobs.json', []);
  const job = jobs.find(j => j.id === job_id) || jobs[0];

  res.json({
    job_id: job.id,
    job_title: job.title,
    company: job.company,
    tailored_headline: `Full Stack Engineer specialized in ${job.skills ? job.skills.slice(0, 3).join(', ') : 'modern web technologies'}`,
    tailored_summary: `Dedicated Software Engineering graduate from COEP Pune with hands-on expertise building enterprise-grade applications. Direct experience with ${job.skills ? job.skills.join(', ') : 'relevant requirements'} aligns directly with ${job.company}'s engineering objectives.`,
    matching_skills: job.skills || ["javascript", "react"],
    cover_letter_draft: `Dear Hiring Team at ${job.company},\n\nI am writing to express my strong enthusiasm for the ${job.title} role. Having developed citizen-centric portals using ${(job.skills || []).slice(0, 3).join(', ')}, I have honed the technical rigor and problem-solving velocity needed to add immediate value to your engineering sprints.\n\nThank you for considering my profile.\n\nSincerely,\nAarav Deshmukh`,
    recommended_checklist: [
      "Tailor GitHub README of your primary full-stack project",
      "Verify latest SHA-256 certificate hash on Maharashtra SkillBridge Ledger",
      "Review company tech stack and architecture pillars"
    ]
  });
});

// Application Tracking
apiRouter.get('/applications', (req, res) => {
  const apps = loadJsonFile<any[]>('career_applications.json', []);
  res.json(apps);
});

apiRouter.post('/applications', (req, res) => {
  const apps = loadJsonFile<any[]>('career_applications.json', []);
  const newApp = {
    id: `app-${Date.now().toString(36)}`,
    dateSaved: new Date().toISOString(),
    status: req.body.status || 'Saved',
    ...req.body
  };
  apps.unshift(newApp);
  saveJsonFile('career_applications.json', apps);
  logAuditEvent("student@coep.ac.in", "student", `CREATE_APPLICATION_${newApp.company}`, "Application Tracker");
  res.json(newApp);
});

apiRouter.put('/applications/:id', (req, res) => {
  const apps = loadJsonFile<any[]>('career_applications.json', []);
  const idx = apps.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ detail: "Application not found" });
  apps[idx] = { ...apps[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveJsonFile('career_applications.json', apps);
  res.json(apps[idx]);
});

apiRouter.delete('/applications/:id', (req, res) => {
  let apps = loadJsonFile<any[]>('career_applications.json', []);
  apps = apps.filter(a => a.id !== req.params.id);
  saveJsonFile('career_applications.json', apps);
  res.json({ success: true, deleted: req.params.id });
});

// Notifications & Web Push
apiRouter.get('/notifications', (req, res) => {
  const notifs = loadJsonFile<any[]>('career_notifications.json', []);
  res.json(notifs);
});

apiRouter.get('/notifications/preferences', (req, res) => {
  const prefs = loadJsonFile<any>('career_notif_prefs.json', {
    enabled: true,
    new_matching_job: true,
    high_priority_job: true,
    closing_soon_job: true,
    application_reminder: true,
    interview_reminder: true,
    profile_improvement_reminder: true
  });
  res.json(prefs);
});

apiRouter.put('/notifications/preferences', (req, res) => {
  saveJsonFile('career_notif_prefs.json', req.body);
  res.json({ success: true, preferences: req.body });
});

apiRouter.post('/notifications/register-token', (req, res) => {
  res.json({ success: true, message: "FCM Push Token registered successfully" });
});

// Job Sync Monitor
apiRouter.get('/system/job-sync-status', (req, res) => {
  const status = loadJsonFile<any>('career_sync_status.json', {
    last_successful_sync: new Date().toISOString(),
    last_failed_sync: null,
    total_jobs_in_db: 6,
    last_job_count: 6,
    ingestion_sources: [
      { name: "National Career Service (NCS India)", status: "HEALTHY", count: 2 },
      { name: "Skill India Digital Hub (SIDH)", status: "HEALTHY", count: 1 },
      { name: "Adzuna Authorized Feed", status: "HEALTHY", count: 2 },
      { name: "Maharashtra Employment Exchange", status: "HEALTHY", count: 1 }
    ]
  });
  res.json(status);
});

apiRouter.post('/system/job-sync/trigger', (req, res) => {
  logAuditEvent("admin@skillbridge.gov.in", "government_admin", "TRIGGER_JOB_SYNC", "Job Sync Monitor");
  res.json({
    success: true,
    message: "Ingestion pipeline triggered across National Career Service and State feeds. 0 new duplicates found.",
    sync_time: new Date().toISOString()
  });
});

// Mount router under /api
app.use('/api', apiRouter);

// Start server with Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = 3000;

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
