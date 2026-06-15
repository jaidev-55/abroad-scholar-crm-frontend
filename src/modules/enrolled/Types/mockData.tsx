
import {
  RiHome4Line,
  RiExchangeFundsLine,
  RiHospitalLine,
  RiSimCard2Line,
  RiBusLine,
  RiGroupLine,
} from "react-icons/ri";
import type { EnrolledStudent, Document, VisaInfo } from "../Types";

const STUDENT_SEEDS = [
  {
    name: "Aarav Mehta",
    country: "🇬🇧 UK",
    university: "University of Manchester",
    course: "MSc Data Science",
    counselor: "Priya Sharma",
  },
  {
    name: "Sneha Reddy",
    country: "🇨🇦 Canada",
    university: "University of Toronto",
    course: "MBA",
    counselor: "Arjun Patel",
  },
  {
    name: "Kunal Joshi",
    country: "🇺🇸 USA",
    university: "Boston University",
    course: "MS Computer Science",
    counselor: "Sarah Khan",
  },
  {
    name: "Ishita Gupta",
    country: "🇦🇺 Australia",
    university: "University of Melbourne",
    course: "MPhil Psychology",
    counselor: "Rohan Mehta",
  },
  {
    name: "Rahul Nair",
    country: "🇩🇪 Germany",
    university: "TU Munich",
    course: "MS Engineering",
    counselor: "Anita Desai",
  },
  {
    name: "Meera Iyer",
    country: "🇬🇧 UK",
    university: "UCL London",
    course: "MSc Finance",
    counselor: "Priya Sharma",
  },
  {
    name: "Vikram Singh",
    country: "🇮🇪 Ireland",
    university: "Trinity College Dublin",
    course: "MSc AI",
    counselor: "Arjun Patel",
  },
  {
    name: "Pooja Bhat",
    country: "🇨🇦 Canada",
    university: "McGill University",
    course: "MA Education",
    counselor: "Sarah Khan",
  },
  {
    name: "Aryan Kapoor",
    country: "🇺🇸 USA",
    university: "Columbia University",
    course: "MS Statistics",
    counselor: "Rohan Mehta",
  },
  {
    name: "Diya Sharma",
    country: "🇦🇺 Australia",
    university: "UNSW Sydney",
    course: "MBA International Business",
    counselor: "Anita Desai",
  },
  {
    name: "Karthik Rajan",
    country: "🇬🇧 UK",
    university: "Imperial College London",
    course: "MSc Machine Learning",
    counselor: "Priya Sharma",
  },
  {
    name: "Nisha Patel",
    country: "🇳🇿 New Zealand",
    university: "University of Auckland",
    course: "PGDip Marketing",
    counselor: "Arjun Patel",
  },
];

const DOC_TYPES = [
  { name: "Passport", type: "passport" },
  { name: "Offer Letter", type: "offer_letter" },
  { name: "CAS / I-20", type: "cas" },
  { name: "Fee Receipt", type: "fee_receipt" },
  { name: "SOP", type: "sop" },
  { name: "LOR", type: "lor" },
  { name: "Bank Statement", type: "bank_statement" },
  { name: "Visa Copy", type: "visa_copy" },
  { name: "Air Ticket", type: "air_ticket" },
];

const RISK_POOL = [
  "Visa rejection history",
  "Financial risk",
  "Low IELTS score",
  "Missing documents",
  "Payment overdue",
  "Passport expiring soon",
];

export const generateStudents = (): EnrolledStudent[] => {
  return STUDENT_SEEDS.map((s, i) => {
    const stage = Math.min(Math.floor(Math.random() * 8), 7);
    const feeTotal = 15000 + Math.floor(Math.random() * 25000);
    const feePaid = stage >= 3 ? feeTotal : stage >= 2 ? feeTotal * 0.3 : 0;
    const intakeDate = new Date(2026, 8, 1 + Math.floor(Math.random() * 30));
    const visaStatuses: VisaInfo["status"][] = [
      "not_started",
      "filed",
      "biometric_done",
      "interview_done",
      "approved",
      "rejected",
    ];
    const visaIdx =
      stage >= 7 ? 4 : stage >= 6 ? 4 : stage >= 5 ? Math.min(stage - 4, 3) : 0;

    return {
      id: `STU-${1000 + i}`,
      name: s.name,
      studentId: `STU-${1000 + i}`,
      phone: `+91 ${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${s.name.toLowerCase().replace(" ", ".")}@email.com`,
      country: s.country,
      university: s.university,
      course: s.course,
      intake: "Sep 2026",
      intakeDate: intakeDate.toISOString().split("T")[0],
      counselor: s.counselor,
      feePaid,
      feeTotal,
      visaStatus: visaStatuses[visaIdx],
      travelStatus:
        stage >= 7 ? "departed" : stage >= 6 ? "booked" : "not_booked",
      admissionStage: stage,
      stageHistory: [],
      ieltsScore: `${(5.5 + Math.random() * 2.5).toFixed(1)}`,
      documents: DOC_TYPES.map((d, di) => ({
        id: `doc-${i}-${di}`,
        name: d.name,
        type: d.type,
        status: (di <= stage + 1
          ? di <= stage
            ? "verified"
            : "uploaded"
          : "pending") as Document["status"],
        uploadedAt:
          di <= stage
            ? new Date(Date.now() - Math.random() * 30 * 86400000)
                .toISOString()
                .split("T")[0]
            : null,
        expiryDate:
          d.type === "passport"
            ? new Date(Date.now() + 365 * 86400000 * (1 + Math.random()))
                .toISOString()
                .split("T")[0]
            : null,
      })),
      payments: [
        {
          id: `pay-${i}-1`,
          type: "Tuition Fee",
          amount: feeTotal,
          currency: "USD",
          status: feePaid >= feeTotal ? "paid" : "pending",
          dueDate: new Date(Date.now() + 30 * 86400000)
            .toISOString()
            .split("T")[0],
          paidDate:
            feePaid >= feeTotal
              ? new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0]
              : null,
          mode: "Bank Transfer",
        },
        {
          id: `pay-${i}-2`,
          type: "Initial Deposit",
          amount: Math.round(feeTotal * 0.15),
          currency: "USD",
          status: stage >= 2 ? "paid" : stage >= 1 ? "pending" : "overdue",
          dueDate: new Date(Date.now() - 5 * 86400000)
            .toISOString()
            .split("T")[0],
          paidDate:
            stage >= 2
              ? new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0]
              : null,
          mode: "Online Payment",
        },
      ],
      communications: [
        {
          id: `comm-${i}-1`,
          type: "call",
          summary: "Discussed admission progress and next steps",
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          by: s.counselor,
        },
        {
          id: `comm-${i}-2`,
          type: "whatsapp",
          summary: "Sent document checklist and deadlines",
          date: new Date(Date.now() - 5 * 86400000).toISOString(),
          by: s.counselor,
        },
        {
          id: `comm-${i}-3`,
          type: "email",
          summary: "Offer letter forwarded with acceptance instructions",
          date: new Date(Date.now() - 8 * 86400000).toISOString(),
          by: s.counselor,
        },
      ],
      visa: {
        type: s.country.includes("UK")
          ? "Tier 4"
          : s.country.includes("US")
            ? "F-1"
            : s.country.includes("Canada")
              ? "Study Permit"
              : "Student Visa",
        filingDate:
          stage >= 5
            ? new Date(Date.now() - 20 * 86400000).toISOString().split("T")[0]
            : null,
        biometricDate:
          stage >= 5
            ? new Date(Date.now() - 15 * 86400000).toISOString().split("T")[0]
            : null,
        interviewDate:
          stage >= 6
            ? new Date(Date.now() - 10 * 86400000).toISOString().split("T")[0]
            : null,
        status: visaStatuses[visaIdx],
        passportNumber: `P${Math.floor(Math.random() * 9000000 + 1000000)}`,
        passportExpiry: new Date(
          Date.now() + 365 * 86400000 * (1 + Math.random()),
        )
          .toISOString()
          .split("T")[0],
      },
      preDeparture: [
        {
          id: "pd-1",
          label: "Accommodation Booked",
          completed: stage >= 6,
          icon: <RiHome4Line size={14} />,
        },
        {
          id: "pd-2",
          label: "Forex Arranged",
          completed: stage >= 7,
          icon: <RiExchangeFundsLine size={14} />,
        },
        {
          id: "pd-3",
          label: "Insurance Purchased",
          completed: stage >= 6,
          icon: <RiHospitalLine size={14} />,
        },
        {
          id: "pd-4",
          label: "SIM Card Arranged",
          completed: stage >= 7,
          icon: <RiSimCard2Line size={14} />,
        },
        {
          id: "pd-5",
          label: "Airport Pickup Arranged",
          completed: stage >= 7,
          icon: <RiBusLine size={14} />,
        },
        {
          id: "pd-6",
          label: "Pre-departure Session",
          completed: stage >= 5,
          icon: <RiGroupLine size={14} />,
        },
      ],
      commission: {
        universityRate: 10 + Math.floor(Math.random() * 10),
        subAgentRate: Math.floor(Math.random() * 5),
        expectedAmount: Math.round(feeTotal * (0.1 + Math.random() * 0.1)),
        receivedAmount: stage >= 4 ? Math.round(feeTotal * 0.08) : 0,
        paymentStatus: stage >= 6 ? "paid" : stage >= 4 ? "partial" : "pending",
        agreementUploaded: stage >= 2,
      },
      risks: RISK_POOL.filter(() => Math.random() > 0.7),
    };
  });
};
