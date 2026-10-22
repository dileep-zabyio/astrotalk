import { z } from "zod";
// 1. User Login Schema (matching the login form fields)
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  idProof: z
    .any()
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// 2. Astrologer Profile Schema
export const astrologerSchema = z.object({
  id: z.string().uuid().or(z.string()),
  name: z.string().min(2, "Name must have at least 2 characters"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  experienceYears: z.number().min(0, "Experience cannot be negative"),
  rating: z.number().min(0).max(5).default(5.0),
  reviewsCount: z.number().int().min(0).default(0),
  pricePerMinute: z.number().positive("Price must be greater than 0"),
  isOnline: z.boolean().default(false),
  image: z.string().url().or(z.string()),
});

export type Astrologer = z.infer<typeof astrologerSchema>;

// 3. Free Kundli Generation Form Schema
export const kundliSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  gender: z.enum(["male", "female", "other"], {
    error: "Please select a gender",
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
});

export type KundliFormData = z.infer<typeof kundliSchema>;

// 4. Consultation Booking Schema
export const consultationBookingSchema = z.object({
  astrologerId: z.string().min(1, "Astrologer ID is required"),
  consultationType: z.enum(["chat", "audio_call", "video_call", "pooja"]),
  topic: z.enum([
    "love_relationship",
    "career_business",
    "marriage",
    "health",
    "finance",
    "general",
  ]),
  userNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export type ConsultationBooking = z.infer<typeof consultationBookingSchema>;
