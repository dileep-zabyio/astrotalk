"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginSchema } from "@/src/schema";

const LoginPage = () => {
  const router = useRouter();

  // 1. Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 2. Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 3. Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear error as the user types
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  // 4. Form submit with Zod validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    router.push("/dashboard");
  };

  return (
    <main className="flex flex-1 w-full min-h-screen flex-col items-center justify-center py-24 px-8 bg-[#09090b] sm:items-center">
      <div className="flex bg-[#121216] border border-neutral-800 rounded-2xl p-6 shadow-xl w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 text-neutral-200 w-full"
        >
          <div className="mb-2 text-center">
            <h1 className="text-lg font-semibold text-neutral-100">Welcome to Astrotalk</h1>
            <p className="text-xs text-neutral-400 mt-0.5">Sign in to your account</p>
          </div>

          {/* Email */}
          <label className="text-xs font-medium text-neutral-300">Email</label>
          <input
            id="email"
            className="flex border border-neutral-700 bg-neutral-900 rounded-lg p-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition"
            type="text"
            placeholder="abc@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <span className="text-red-400 text-xs">{errors.email}</span>
          )}

          {/* Password */}
          <label className="text-xs font-medium text-neutral-300">Password</label>
          <input
            id="password"
            className="flex border border-neutral-700 bg-neutral-900 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neutral-500 transition"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="text-red-400 text-xs">{errors.password}</span>
          )}

          {/* ID Upload */}
          <label className="text-xs font-medium text-neutral-300">Upload your ID</label>
          <input
            className="flex border border-neutral-700 bg-neutral-900 rounded-lg p-2 text-xs text-neutral-400 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-200"
            type="file"
            multiple
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-neutral-200 hover:bg-white text-neutral-900 rounded-lg text-center py-2 font-medium text-xs transition mt-2 cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
