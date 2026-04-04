import type { Lead } from "../types/lead";

const NAMES = [
  "Aarav Mehta",
  "Sneha Reddy",
  "Kunal Joshi",
  "Ishita Gupta",
  "Rahul Nair",
  "Meera Iyer",
  "Vikram Singh",
  "Pooja Bhat",
  "Aryan Kapoor",
  "Diya Sharma",
  "Karthik Rajan",
  "Nisha Patel",
  "Aditya Rao",
  "Simran Kaur",
  "Varun Das",
  "Priya Nambiar",
  "Rohan Khanna",
  "Ananya Srinivasan",
  "Dev Malhotra",
  "Lakshmi Menon",
  "Siddharth Agarwal",
  "Kavya Nair",
  "Nikhil Choudhary",
  "Ritu Banerjee",
  "Amrit Singh",
  "Tanya Jain",
  "Harsh Vardhan",
  "Neha Kulkarni",
  "Pranav Desai",
  "Swati Mishra",
  "Akash Pandey",
  "Divya Krishnan",
  "Manish Tiwari",
  "Shruti Hegde",
  "Rajat Saxena",
];

export const STAGES = ["new", "progress", "applied", "converted"] as const;
export type Stage = (typeof STAGES)[number];

export const SOURCES = [
  "Website",
  "Referral",
  "Facebook",
  "Instagram",
  "Walk-in",
  "Google Ads",
  "Education Fair",
] as const;

export const COUNSELORS = [
  "Priya Sharma",
  "Arjun Patel",
  "Sarah Khan",
  "Rohan Mehta",
  "Anita Desai",
] as const;

export const COUNTRIES = [
  "🇬🇧 UK",
  "🇨🇦 Canada",
  "🇺🇸 USA",
  "🇦🇺 Australia",
  "🇩🇪 Germany",
  "🇮🇪 Ireland",
  "🇳🇿 New Zealand",
] as const;

export const PRIORITIES = ["Hot", "Warm", "Cold"] as const;
export type Priority = (typeof PRIORITIES)[number];

// ─────────────────────────────────────────────
// FACTORY
// ─────────────────────────────────────────────
function pick<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
}

function generateLeads(): Lead[] {
  return NAMES.map((name, i): Lead => {
    const stage = pick(STAGES, i);
    const counselor = pick(COUNSELORS, i);
    const hasNote = i % 3 === 0;

    return {
      id: `lead-${i + 1}`,
      name,
      phone: `+91 ${9000000000 + randomBetween(0, 999999999)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      stage,
      source: pick(SOURCES, i),
      counselor,
      country: pick(COUNTRIES, i),
      priority: pick(PRIORITIES, i),
      followUp: isoDate(randomBetween(-7, 14)),
      createdAt: isoDate(-randomBetween(0, 30)),
      ieltsScore:
        stage === "applied" || stage === "converted"
          ? `${(5.5 + Math.random() * 2.5).toFixed(1)}`
          : null,
      notes: hasNote
        ? [
            {
              id: `note-${i}`,
              text: "Student is very interested in UK universities. Follow up about IELTS preparation.",
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              author: counselor,
            },
          ]
        : [],
    };
  });
}

export const LEADS_DATA: Lead[] = generateLeads();
