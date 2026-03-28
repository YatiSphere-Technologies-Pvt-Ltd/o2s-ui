/* ================================================================
   O2S CV Screening — AI-Powered Resume Analysis
   Types, Mock Data & Helpers
   ================================================================ */

export type ScreeningTab = "upload" | "results" | "history" | "settings";

export const SCREENING_TABS: { key: ScreeningTab; label: string }[] = [
  { key: "upload", label: "Screen CVs" },
  { key: "results", label: "Analysis Results" },
  { key: "history", label: "Screening History" },
  { key: "settings", label: "Screening Config" },
];

/* ── Screening Result Types ── */

export interface SkillMatch {
  skill: string;
  required: boolean;
  found: boolean;
  proficiency: "expert" | "advanced" | "intermediate" | "beginner" | "not_found";
  evidence: string;
  yearsOfExperience: number | null;
}

export interface ExperienceAnalysis {
  totalYears: number;
  relevantYears: number;
  companies: { name: string; role: string; duration: string; relevance: "high" | "medium" | "low" }[];
  careerTrajectory: "ascending" | "lateral" | "mixed" | "declining";
  industryMatch: number;
}

export interface EducationAnalysis {
  degree: string;
  institution: string;
  year: string;
  relevance: "high" | "medium" | "low";
  certifications: string[];
}

export interface RedFlag {
  type: "gap" | "short_tenure" | "inconsistency" | "overqualified" | "underqualified" | "location_mismatch";
  severity: "high" | "medium" | "low";
  description: string;
  recommendation: string;
}

export interface GreenFlag {
  type: "strong_match" | "growth" | "leadership" | "domain_expertise" | "referral" | "prestigious_company";
  description: string;
}

export interface ScreeningResult {
  id: string;
  candidateName: string;
  candidateInitials: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  linkedIn: string;
  resumeFileName: string;
  screenedAt: string;
  screenedAgainst: string;
  requisitionId: string;

  // Overall Scores
  overallScore: number;
  recommendation: "strong_match" | "good_match" | "moderate_match" | "weak_match" | "no_match";
  confidence: number;

  // Detailed Breakdown
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  cultureFitScore: number;
  communicationScore: number;

  // Detailed Analysis
  skillMatches: SkillMatch[];
  experience: ExperienceAnalysis;
  education: EducationAnalysis;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];

  // AI Summary
  aiSummary: string;
  aiStrengths: string[];
  aiConcerns: string[];
  aiRecommendation: string;
  suggestedInterviewFocus: string[];

  // Comparison to other candidates
  percentileRank: number;
  comparedTo: number;
}

/* ── Screening History Entry ── */

export interface ScreeningHistoryEntry {
  id: string;
  candidateName: string;
  candidateInitials: string;
  requisition: string;
  requisitionId: string;
  overallScore: number;
  recommendation: string;
  screenedAt: string;
  screenedBy: string;
  status: "reviewed" | "pending_review" | "auto_advanced" | "auto_rejected" | "manual_override";
  action: string | null;
}

/* ── Mock Data ── */

export const SCREENING_RESULTS: ScreeningResult[] = [
  {
    id: "scr-001",
    candidateName: "Sarah Chen",
    candidateInitials: "SC",
    email: "sarah.chen@gmail.com",
    phone: "+1 650-555-0100",
    location: "San Francisco, CA",
    currentRole: "Senior Frontend Engineer",
    currentCompany: "Google",
    linkedIn: "linkedin.com/in/sarahchen",
    resumeFileName: "Sarah_Chen_Resume_2026.pdf",
    screenedAt: "2 hours ago",
    screenedAgainst: "Senior Frontend Engineer",
    requisitionId: "REQ-2026-001",
    overallScore: 92,
    recommendation: "strong_match",
    confidence: 96,
    skillsScore: 95,
    experienceScore: 90,
    educationScore: 88,
    cultureFitScore: 85,
    communicationScore: 92,
    skillMatches: [
      { skill: "React", required: true, found: true, proficiency: "expert", evidence: "Led React migration at Google, 7 years", yearsOfExperience: 7 },
      { skill: "TypeScript", required: true, found: true, proficiency: "expert", evidence: "Primary language in all recent roles", yearsOfExperience: 5 },
      { skill: "Next.js", required: true, found: true, proficiency: "advanced", evidence: "Built SSR apps at Stripe, OSS contributions", yearsOfExperience: 3 },
      { skill: "System Design", required: true, found: true, proficiency: "advanced", evidence: "Designed real-time collaborative editor", yearsOfExperience: 4 },
      { skill: "GraphQL", required: true, found: false, proficiency: "not_found", evidence: "No mention in resume or projects", yearsOfExperience: null },
      { skill: "Testing", required: true, found: true, proficiency: "advanced", evidence: "Built E2E testing strategy at Stripe (Playwright)", yearsOfExperience: 4 },
      { skill: "CSS/Tailwind", required: false, found: true, proficiency: "expert", evidence: "Design system development at Google", yearsOfExperience: 7 },
      { skill: "Performance Optimization", required: false, found: true, proficiency: "expert", evidence: "40% performance improvement on critical path", yearsOfExperience: 5 },
      { skill: "Mentoring", required: false, found: true, proficiency: "advanced", evidence: "Mentored 8 engineers, 3 promoted to senior", yearsOfExperience: 3 },
    ],
    experience: {
      totalYears: 7,
      relevantYears: 7,
      companies: [
        { name: "Google", role: "Senior Frontend Engineer", duration: "5 years", relevance: "high" },
        { name: "Stripe", role: "Frontend Engineer", duration: "1.5 years", relevance: "high" },
      ],
      careerTrajectory: "ascending",
      industryMatch: 95,
    },
    education: {
      degree: "B.S. Computer Science",
      institution: "Stanford University",
      year: "2019",
      relevance: "high",
      certifications: ["AWS Certified Solutions Architect"],
    },
    redFlags: [
      { type: "gap", severity: "low", description: "No GraphQL experience listed — required skill", recommendation: "Probe in technical interview; React Query experience may transfer" },
    ],
    greenFlags: [
      { type: "prestigious_company", description: "5 years at Google with scale experience (150K+ users)" },
      { type: "leadership", description: "Mentored 8 engineers, 3 promoted — strong leadership signal" },
      { type: "growth", description: "Clear career progression: Stripe → Google with increasing scope" },
      { type: "domain_expertise", description: "Design system ownership — directly relevant to role" },
    ],
    aiSummary: "Sarah is an exceptionally strong candidate for the Senior Frontend Engineer role. With 7 years of React/TypeScript expertise at Google and Stripe, she exceeds the technical bar significantly. Her design system ownership and mentorship track record align perfectly with the role's leadership expectations. The only gap is GraphQL experience, which is addressable given her strong API experience.",
    aiStrengths: [
      "7 years of React expertise at Google-scale applications",
      "Design system ownership directly relevant to role",
      "Strong mentorship track record — 8 engineers mentored, 3 promoted",
      "40% performance improvement demonstrates optimization skills",
      "Published author and conference speaker — thought leader",
    ],
    aiConcerns: [
      "No GraphQL experience (required skill) — may need ramp-up",
      "All experience at large companies — startup pace may differ",
      "Expected CTC ($200-220K) is at top of band",
    ],
    aiRecommendation: "Strongly recommend advancing to technical interview. Schedule system design round to validate architecture skills at our scale. Address GraphQL gap in interview — likely quick ramp given strong API background.",
    suggestedInterviewFocus: [
      "System design: How would she architect our component library?",
      "GraphQL: Probe transferable skills from REST/React Query",
      "Mentoring style: How does she approach growing junior engineers?",
      "Startup fit: Comfort with ambiguity and pace",
    ],
    percentileRank: 95,
    comparedTo: 47,
  },
  {
    id: "scr-002",
    candidateName: "Rahul Sharma",
    candidateInitials: "RS",
    email: "rahul.sharma@outlook.com",
    phone: "+91 98765-43210",
    location: "Pune, India",
    currentRole: "Frontend Developer",
    currentCompany: "TCS",
    linkedIn: "linkedin.com/in/rahulsharma",
    resumeFileName: "Rahul_Sharma_CV.pdf",
    screenedAt: "1 hour ago",
    screenedAgainst: "Senior Frontend Engineer",
    requisitionId: "REQ-2026-001",
    overallScore: 58,
    recommendation: "moderate_match",
    confidence: 82,
    skillsScore: 62,
    experienceScore: 55,
    educationScore: 70,
    cultureFitScore: 50,
    communicationScore: 55,
    skillMatches: [
      { skill: "React", required: true, found: true, proficiency: "intermediate", evidence: "Used React in 2 projects over 3 years", yearsOfExperience: 3 },
      { skill: "TypeScript", required: true, found: true, proficiency: "beginner", evidence: "Recent adoption, limited usage", yearsOfExperience: 1 },
      { skill: "Next.js", required: true, found: false, proficiency: "not_found", evidence: "No mention", yearsOfExperience: null },
      { skill: "System Design", required: true, found: false, proficiency: "not_found", evidence: "No system design experience listed", yearsOfExperience: null },
      { skill: "GraphQL", required: true, found: false, proficiency: "not_found", evidence: "No mention", yearsOfExperience: null },
      { skill: "Testing", required: true, found: true, proficiency: "beginner", evidence: "Unit testing with Jest mentioned", yearsOfExperience: 1 },
    ],
    experience: {
      totalYears: 4,
      relevantYears: 3,
      companies: [
        { name: "TCS", role: "Frontend Developer", duration: "3 years", relevance: "medium" },
        { name: "Infosys", role: "Associate Developer", duration: "1 year", relevance: "low" },
      ],
      careerTrajectory: "lateral",
      industryMatch: 40,
    },
    education: {
      degree: "B.Tech Computer Science",
      institution: "Pune University",
      year: "2022",
      relevance: "medium",
      certifications: [],
    },
    redFlags: [
      { type: "underqualified", severity: "high", description: "4 years total experience vs 5+ required. Senior-level skills gap.", recommendation: "Consider for IC3 role instead" },
      { type: "short_tenure", severity: "medium", description: "Only 1 year at Infosys before moving to TCS", recommendation: "Probe reasons for short tenure in screen" },
    ],
    greenFlags: [
      { type: "growth", description: "Solid foundational React skills, growing trajectory" },
    ],
    aiSummary: "Rahul has solid foundational skills but falls short of the Senior Frontend Engineer requirements. With 4 years of experience (3 relevant), he's below the 5-year minimum. Missing critical skills: Next.js, System Design, GraphQL. Better suited for a mid-level (IC2-IC3) role.",
    aiStrengths: ["Solid React fundamentals with 3 years of hands-on experience", "Growing into TypeScript — shows willingness to learn"],
    aiConcerns: ["Below minimum experience requirement (4 vs 5+ years)", "Missing 3 of 6 required skills", "No system design or architecture experience", "Limited testing experience", "Career trajectory is lateral rather than ascending"],
    aiRecommendation: "Does not meet the bar for Senior Frontend Engineer. Recommend for Frontend Engineer (IC2-IC3) role if available, or archive for future consideration.",
    suggestedInterviewFocus: [],
    percentileRank: 25,
    comparedTo: 47,
  },
  {
    id: "scr-003",
    candidateName: "Priya Desai",
    candidateInitials: "PD",
    email: "priya.desai@proton.me",
    phone: "+91 87654-32109",
    location: "Bangalore, India",
    currentRole: "Senior Software Engineer",
    currentCompany: "Razorpay",
    linkedIn: "linkedin.com/in/priyadesai",
    resumeFileName: "Priya_Desai_Resume.pdf",
    screenedAt: "45 min ago",
    screenedAgainst: "Senior Frontend Engineer",
    requisitionId: "REQ-2026-001",
    overallScore: 81,
    recommendation: "good_match",
    confidence: 89,
    skillsScore: 85,
    experienceScore: 80,
    educationScore: 82,
    cultureFitScore: 78,
    communicationScore: 80,
    skillMatches: [
      { skill: "React", required: true, found: true, proficiency: "advanced", evidence: "4 years at Razorpay, built payment dashboard", yearsOfExperience: 4 },
      { skill: "TypeScript", required: true, found: true, proficiency: "advanced", evidence: "Migrated legacy codebase to TypeScript", yearsOfExperience: 3 },
      { skill: "Next.js", required: true, found: true, proficiency: "intermediate", evidence: "Used for merchant dashboard", yearsOfExperience: 2 },
      { skill: "System Design", required: true, found: true, proficiency: "intermediate", evidence: "Designed checkout micro-frontend architecture", yearsOfExperience: 2 },
      { skill: "GraphQL", required: true, found: true, proficiency: "intermediate", evidence: "API layer for merchant tools", yearsOfExperience: 2 },
      { skill: "Testing", required: true, found: true, proficiency: "advanced", evidence: "90% coverage mandate, Cypress + Jest", yearsOfExperience: 4 },
    ],
    experience: {
      totalYears: 6,
      relevantYears: 5,
      companies: [
        { name: "Razorpay", role: "Senior Software Engineer", duration: "4 years", relevance: "high" },
        { name: "Flipkart", role: "Software Engineer", duration: "2 years", relevance: "high" },
      ],
      careerTrajectory: "ascending",
      industryMatch: 85,
    },
    education: {
      degree: "B.Tech CS",
      institution: "IIT Bombay",
      year: "2020",
      relevance: "high",
      certifications: ["AWS Cloud Practitioner"],
    },
    redFlags: [],
    greenFlags: [
      { type: "domain_expertise", description: "Fintech scale experience at Razorpay (50M+ transactions)" },
      { type: "strong_match", description: "All 6 required skills matched" },
      { type: "prestigious_company", description: "Strong pedigree — IIT Bombay + Flipkart + Razorpay" },
    ],
    aiSummary: "Priya is a strong candidate who matches all 6 required skills. Her fintech experience at Razorpay with 50M+ transaction scale is directly relevant. All skills are at least intermediate level. A solid choice for the Pune slot given her Bangalore location flexibility.",
    aiStrengths: ["All 6 required skills matched — no gaps", "Scale experience at Razorpay (50M+ transactions)", "TypeScript migration experience shows modernization skills", "Strong testing culture (90% coverage)"],
    aiConcerns: ["System Design skills at intermediate vs advanced needed for IC4", "Slightly less React experience (4 yrs) vs ideal (5+)"],
    aiRecommendation: "Good match. Recommend advancing to technical interview with focus on system design depth. Strong candidate for Pune slot.",
    suggestedInterviewFocus: ["System design: Probe depth beyond micro-frontends", "Scale: How did she handle Razorpay's traffic patterns?", "Testing philosophy: What's her approach to test architecture?"],
    percentileRank: 78,
    comparedTo: 47,
  },
];

/* ── Screening History ── */

export const SCREENING_HISTORY: ScreeningHistoryEntry[] = [
  { id: "sh1", candidateName: "Sarah Chen", candidateInitials: "SC", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", overallScore: 92, recommendation: "Strong Match", screenedAt: "2 hours ago", screenedBy: "AI Recruiter Agent", status: "auto_advanced", action: "Advanced to Screened" },
  { id: "sh2", candidateName: "Priya Desai", candidateInitials: "PD", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", overallScore: 81, recommendation: "Good Match", screenedAt: "45 min ago", screenedBy: "AI Recruiter Agent", status: "pending_review", action: null },
  { id: "sh3", candidateName: "Rahul Sharma", candidateInitials: "RS", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", overallScore: 58, recommendation: "Moderate Match", screenedAt: "1 hour ago", screenedBy: "AI Recruiter Agent", status: "pending_review", action: null },
  { id: "sh4", candidateName: "Alex Wright", candidateInitials: "AW", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", overallScore: 45, recommendation: "Weak Match", screenedAt: "3 hours ago", screenedBy: "AI Recruiter Agent", status: "auto_rejected", action: "Auto-archived (score <50)" },
  { id: "sh5", candidateName: "Lin Chen", candidateInitials: "LC", requisition: "Sr Frontend Engineer", requisitionId: "REQ-2026-001", overallScore: 72, recommendation: "Good Match", screenedAt: "Yesterday", screenedBy: "Sarah Kim", status: "reviewed", action: "Advanced to Interview" },
  { id: "sh6", candidateName: "Marcus Chen", candidateInitials: "MC", requisition: "Backend Engineer", requisitionId: "REQ-2026-002", overallScore: 88, recommendation: "Strong Match", screenedAt: "Yesterday", screenedBy: "AI Recruiter Agent", status: "auto_advanced", action: "Advanced to Screened" },
  { id: "sh7", candidateName: "Jordan Lee", candidateInitials: "JL", requisition: "DevOps Engineer", requisitionId: "REQ-2026-007", overallScore: 76, recommendation: "Good Match", screenedAt: "2 days ago", screenedBy: "AI Recruiter Agent", status: "manual_override", action: "Manually advanced (override)" },
  { id: "sh8", candidateName: "Casey Davis", candidateInitials: "CD", requisition: "Product Designer", requisitionId: "REQ-2026-003", overallScore: 84, recommendation: "Strong Match", screenedAt: "2 days ago", screenedBy: "AI Recruiter Agent", status: "auto_advanced", action: "Advanced to Screened" },
];

/* ── Score Helpers ── */

export function scoreColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-brand-teal";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function scoreBgColor(score: number): string {
  if (score >= 90) return "bg-success";
  if (score >= 75) return "bg-brand-teal";
  if (score >= 60) return "bg-brand";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  return "Weak";
}

export function recColor(rec: string): string {
  switch (rec) {
    case "strong_match": return "text-success";
    case "good_match": return "text-brand-teal";
    case "moderate_match": return "text-warning";
    case "weak_match": return "text-destructive";
    case "no_match": return "text-destructive";
    default: return "text-muted-foreground";
  }
}

export function recBgColor(rec: string): string {
  switch (rec) {
    case "strong_match": return "bg-success/10";
    case "good_match": return "bg-brand-teal/10";
    case "moderate_match": return "bg-warning/10";
    case "weak_match": return "bg-destructive/10";
    case "no_match": return "bg-destructive/10";
    default: return "bg-secondary";
  }
}

export function recLabel(rec: string): string {
  switch (rec) {
    case "strong_match": return "Strong Match";
    case "good_match": return "Good Match";
    case "moderate_match": return "Moderate Match";
    case "weak_match": return "Weak Match";
    case "no_match": return "No Match";
    default: return rec;
  }
}

export function proficiencyColor(prof: string): string {
  switch (prof) {
    case "expert": return "text-success";
    case "advanced": return "text-brand-teal";
    case "intermediate": return "text-brand";
    case "beginner": return "text-warning";
    case "not_found": return "text-destructive";
    default: return "text-muted-foreground";
  }
}

export function proficiencyBar(prof: string): number {
  switch (prof) {
    case "expert": return 100;
    case "advanced": return 80;
    case "intermediate": return 60;
    case "beginner": return 40;
    case "not_found": return 0;
    default: return 0;
  }
}

export const HISTORY_STATUS_CONFIG: Record<string, { label: string; dotClass: string; textClass: string }> = {
  reviewed: { label: "Reviewed", dotClass: "bg-success", textClass: "text-success" },
  pending_review: { label: "Pending Review", dotClass: "bg-warning", textClass: "text-warning" },
  auto_advanced: { label: "Auto-Advanced", dotClass: "bg-brand-teal", textClass: "text-brand-teal" },
  auto_rejected: { label: "Auto-Rejected", dotClass: "bg-destructive", textClass: "text-destructive" },
  manual_override: { label: "Manual Override", dotClass: "bg-brand-purple", textClass: "text-brand-purple" },
};
