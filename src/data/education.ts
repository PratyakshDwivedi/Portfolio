/**
 * EDUCATION timeline, exact facts as supplied.
 */
export interface EducationEntry {
  id: string;
  level: string;
  institution: string;
  detail: string;
  year: string;
  status?: string;
}

export const education: EducationEntry[] = [
  {
    id: "class-10",
    level: "Class 10",
    institution: "Delhi Public School, Civil Lines",
    detail: "Aligarh, Uttar Pradesh",
    year: "2021",
    status: "Passed",
  },
  {
    id: "class-12",
    level: "Class 12",
    institution: "Nihar Meera National Senior Secondary School",
    detail: "Higher Secondary",
    year: "2023",
    status: "Passed",
  },
  {
    id: "undergrad",
    level: "Undergraduate",
    institution: "SRM Institute of Science & Technology (SRM IST)",
    detail: "KTR Campus, Chennai",
    year: "Present",
    status: "Fourth Year",
  },
];

/**
 * FOUNDERS CLUB progression, exact roles/dates as supplied.
 * Used by the About-page career timeline.
 */
export interface FoundersRole {
  id: string;
  date: string;
  role: string;
  note?: string;
}

export const foundersJourney: FoundersRole[] = [
  {
    id: "fc-2024",
    date: "2024",
    role: "Operations & Marketing Team Member",
    note: "Joined the club, on-ground operations and outreach.",
  },
  {
    id: "fc-feb-2025",
    date: "February 2025",
    role: "Associate Lead",
    note: "Stepped up to coordinate initiatives across teams.",
  },
  {
    id: "fc-mar-2025",
    date: "March 2025",
    role: "Vice President",
    note: "Led the club's direction, events and community.",
  },
  {
    id: "fc-may-2026",
    date: "May 2026",
    role: "Advisor",
    note: "Guiding the next generation of the club.",
  },
];

/**
 * MUSICAL background, exact facts as supplied.
 */
export const music = {
  headline: "A trained classical tabla player.",
  lines: [
    "Part of the school music team until Class 10.",
    "Trained in Indian classical tabla, the discipline of rhythm, teental and taal.",
  ],
} as const;
