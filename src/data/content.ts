// 单一数据源: 技能/教育/经历/项目/早期项目
// 标题/副标题/详情键名与 i18n 字典对应

import type { Lang } from '../i18n/I18nProvider';

export interface SkillCategory {
  // titleKey: i18n key, fallbackRaw: raw string for non-i18n fallback
  titleKey: string;
  tags: string[];
}

export const skills: SkillCategory[] = [
  {
    titleKey: 'skill_cat_genai',
    tags: [
      'LLMs', 'RAG', 'Multi-Agent Systems', 'SFT', 'RL', 'LoRA / QLoRA',
      'Prompt Engineering', 'Evidence-Constrained Generation',
      'Hallucination Mitigation', 'Model Evaluation',
    ],
  },
  {
    titleKey: 'skill_cat_ml',
    tags: [
      'XGBoost / Random Forest / SVM', 'LSTM / Time Series', 'Feature Engineering',
      'AUC / KS / LIFT', 'Hyperparameter Tuning', 'NLP',
      'Clustering / Segmentation', 'Hadoop / Spark', 'Tableau', 'Power BI',
      'Web Scraping',
    ],
  },
  {
    titleKey: 'skill_cat_prog',
    tags: ['Python', 'R', 'SQL', 'Java', 'JavaScript / HTML / CSS', 'Git / GitHub'],
  },
  {
    titleKey: 'skill_cat_consulting',
    tags: [
      'Credit Scoring', 'Pre-loan Anti-fraud', 'Income Prediction',
      'Customer Segmentation', 'A/B Testing', 'Trigger Marketing',
      'Enterprise Lifecycle Evaluation', 'Risk Early Warning',
      'Dynamic Credit Granting', 'Bank-Enterprise Risk Sharing',
      'Financial Analysis', 'Regulatory Compliance',
    ],
  },
  {
    titleKey: 'skill_cat_esg',
    tags: [
      'ESG Data Collection', 'Social Contribution Monetization',
      'Carbon & Pollutant Tracking', 'Sustainability KPIs',
      'Supply Chain Traceability',
    ],
  },
  {
    titleKey: 'skill_cat_lang',
    tags: [
      'Mandarin (Native)', 'English (Fluent)', 'Cantonese (Conversational)',
      'German (Basic)', 'Client Alignment', 'Cross-Stakeholder Collaboration',
      'End-to-End Consulting', 'Bilingual Technical Writing',
    ],
  },
];

// skill category title 显示为英文/中文, 直接根据 lang 给出 (而不是用 i18n 键)
export const skillCategoryTitles: Record<Lang, string[]> = {
  en: [
    'Generative AI & LLM',
    'ML, Data Science & Big Data',
    'Programming & Databases',
    'Consulting & Risk Analytics',
    'ESG & Sustainable Finance',
    'Languages & Soft Skills',
  ],
  zh: [
    '生成式 AI 与大模型',
    '机器学习、数据科学与大数据',
    '编程与数据库',
    '咨询与风险分析',
    'ESG 与可持续金融',
    '语言与软技能',
  ],
};

export interface EducationItem {
  school: string;
  period: string;
  degKey: string;
  courseKey: string;
  honorKey?: string;
}

export const education: EducationItem[] = [
  {
    school: 'HKUST',
    period: '09/2025 – Present',
    degKey: 'edu_hkust_deg',
    courseKey: 'edu_hkust_course',
  },
  {
    school: 'University of Macau',
    period: '09/2020 – 06/2024',
    degKey: 'edu_um_deg',
    courseKey: 'edu_um_course',
    honorKey: 'edu_um_honor',
  },
];

export interface ExperienceProject {
  titleKey: string;
  details: string[]; // i18n keys
}

export interface ExperienceItem {
  company: string;
  period: string;
  roleKey: string;
  projects: ExperienceProject[];
}

export const experiences: ExperienceItem[] = [
  {
    company: 'Ernst & Young (China) Advisory Limited',
    period: '09/2024 – 08/2025',
    roleKey: 'exp_ey_role',
    projects: [
      { titleKey: 'exp_ey_p1_title', details: ['exp_ey_p1_d1', 'exp_ey_p1_d2', 'exp_ey_p1_d3', 'exp_ey_p1_d4'] },
      { titleKey: 'exp_ey_p2_title', details: ['exp_ey_p2_d1', 'exp_ey_p2_d2', 'exp_ey_p2_d3'] },
      { titleKey: 'exp_ey_p3_title', details: ['exp_ey_p3_d1', 'exp_ey_p3_d2', 'exp_ey_p3_d3', 'exp_ey_p3_d4'] },
    ],
  },
  {
    company: 'Beijing National Institute of ESG',
    period: '06/2024 – 09/2024',
    roleKey: 'exp_esg_role',
    projects: [
      { titleKey: 'exp_esg_p1_title', details: ['exp_esg_p1_d1', 'exp_esg_p1_d2', 'exp_esg_p1_d3'] },
      { titleKey: 'exp_esg_p2_title', details: ['exp_esg_p2_d1', 'exp_esg_p2_d2', 'exp_esg_p2_d3'] },
    ],
  },
];

export interface ProjectItem {
  titleKey: string;
  period: string;
  summaryKey: string;
  details: string[]; // i18n keys
  githubUrl?: string;
}

export const projects: ProjectItem[] = [
  {
    titleKey: 'proj_p1_title',
    period: '02/2026 - Present',
    summaryKey: 'proj_p1_summary',
    details: ['proj_p1_d1', 'proj_p1_d2', 'proj_p1_d3'],
    githubUrl: '#',
  },
  {
    titleKey: 'proj_p2_title',
    period: '09/2025 – 12/2025',
    summaryKey: 'proj_p2_summary',
    details: ['proj_p2_d1', 'proj_p2_d2', 'proj_p2_d3'],
    githubUrl: '#',
  },
  {
    titleKey: 'proj_p3_title',
    period: '09/2025-12/2025',
    summaryKey: 'proj_p3_summary',
    details: ['proj_p3_d1', 'proj_p3_d2', 'proj_p3_d3'],
    githubUrl: '#',
  },
  {
    titleKey: 'proj_p4_title',
    period: '01/2024 - 05/2024',
    summaryKey: 'proj_p4_summary',
    details: ['proj_p4_d1', 'proj_p4_d2', 'proj_p4_d3'],
  },
];

export interface EarlyProject {
  titleKey: string;
  period: string;
  details: string[];
}

export const earlyProjects: EarlyProject[] = [
  {
    titleKey: 'early_p1_title',
    period: '02/2024',
    details: ['early_p1_d1', 'early_p1_d2'],
  },
  {
    titleKey: 'early_p2_title',
    period: '02/2023 - 05/2023',
    details: ['early_p2_d1', 'early_p2_d2'],
  },
  {
    titleKey: 'early_p3_title',
    period: '02/2023 - 05/2023',
    details: ['early_p3_d1', 'early_p3_d2'],
  },
];

export interface NavLink {
  href: string;
  icon: string; // remixicon class
  labelKey: string;
  id: string;
}

export const navLinks: NavLink[] = [
  { id: 'summary',     href: '#summary',     icon: 'ri-user-3-line',         labelKey: 'nav_summary' },
  { id: 'skills',      href: '#skills',      icon: 'ri-tools-line',          labelKey: 'nav_skills' },
  { id: 'education',   href: '#education',   icon: 'ri-graduation-cap-line', labelKey: 'nav_education' },
  { id: 'experience',  href: '#experience',  icon: 'ri-briefcase-line',      labelKey: 'nav_experience' },
  { id: 'projects',    href: '#projects',    icon: 'ri-code-box-line',       labelKey: 'nav_projects' },
  { id: 'early',       href: '#early-projects', icon: 'ri-history-line',     labelKey: 'nav_early' },
  { id: 'extras',      href: '#extras',      icon: 'ri-sparkling-line',      labelKey: 'nav_extras' },
];
