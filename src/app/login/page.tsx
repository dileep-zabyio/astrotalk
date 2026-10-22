"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className="flex flex-1 w-full min-h-screen flex-col items-center justify-center py-32 px-16 bg-gradient-to-r from-black to-yellow-800 sm:items-center">
      <div className="flex bg-gray-300 border-2 rounded-lg pl-1 pr-1 pt-3 pb-3">
        <form className="flex flex-col bg-black gap-2 border-2 rounded-lg p-6">
          <label>Email</label>
          <input
            id="email"
            className="flex border-2 rounded-lg"
            type="text"
            placeholder="   abc@gmail.com"
          />
          <label>Password</label>
          <input
            id="password"
            className="flex border-2 rounded-lg"
            type="password"
            placeholder=""
          />
          <label>Upload your ID</label>
          <input
            className="flex border-2 rounded-lg p-2"
            type="file"
            multiple
          />

          <Link
            href="/dashboard"
            className="bg-green-500 rounded-lg text-center"
            onClick={(event) => {
              handleSubmit(event);
            }}
          >
            Submit
          </Link>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
