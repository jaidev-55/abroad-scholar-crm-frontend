export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "COUNSELOR" | string;
  createdAt: string;
}

export interface AddUserFormValues {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const API_BASE = "http://localhost:3000";

export const ROLE_CONFIG: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  ADMIN: { color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", label: "Admin" },
  COUNSELOR: {
    color: "#0369a1",
    bg: "#f0f9ff",
    border: "#bae6fd",
    label: "Counselor",
  },
};

export const AVATAR_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

export const DUMMY_USERS: User[] = [
  {
    id: "1",
    name: "Ganesh Kumar",
    email: "ganesh@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-03-06T06:39:10.749Z",
  },
  {
    id: "2",
    name: "Jai Prakash",
    email: "jai@abroadscolar.com",
    role: "ADMIN",
    createdAt: "2026-03-05T09:10:04.438Z",
  },
  {
    id: "3",
    name: "Priya Sharma",
    email: "priya@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-02-20T14:22:33.112Z",
  },
  {
    id: "4",
    name: "Arjun Mehta",
    email: "arjun@abroadscolar.com",
    role: "ADMIN",
    createdAt: "2026-02-15T08:45:19.887Z",
  },
  {
    id: "5",
    name: "Sneha Reddy",
    email: "sneha@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-01-28T11:33:45.221Z",
  },
  {
    id: "6",
    name: "Ravi Shankar",
    email: "ravi@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2026-01-10T16:18:07.554Z",
  },
  {
    id: "7",
    name: "Ananya Iyer",
    email: "ananya@abroadscolar.com",
    role: "COUNSELOR",
    createdAt: "2025-12-22T09:55:30.998Z",
  },
  {
    id: "8",
    name: "Vikram Singh",
    email: "vikram@abroadscolar.com",
    role: "ADMIN",
    createdAt: "2025-12-01T07:12:44.667Z",
  },
];
