// import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon } from "@/icons";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0">
      <div className="items-centersm:p-0 relative flex h-screen w-full flex-col justify-center lg:flex-row">
        <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
          <div className="mx-auto w-full max-w-md sm:pt-10">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ChevronLeftIcon />
              Back to dashboard
            </Link>
          </div>
          {children}
        </div>

        <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2">
          <div className="relative z-1 flex items-center justify-center">
            {/* <div className="flex max-w-xs flex-col items-center">
              <Link href="/" className="mb-4 block">
                <Image
                  width={231}
                  height={48}
                  src="images/logo/auth-logo.svg"
                  alt="Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Free and Open-Source Tailwind CSS Admin Dashboard Template
              </p>
            </div> */}
            <div className="mt-15 flex flex-col items-center text-white/90">
              <Link href="/" className="mb-4 block text-center">
                <span className="text-5xl font-extrabold tracking-[0.35em] text-white">
                  IRIS
                </span>
                <div className="mt-1 text-center text-xs leading-4 tracking-wide text-white/70">
                  Intellectual Rights Information System
                </div>
              </Link>

              <p className="text-center text-white/80 w-[60%]">
                Intellectual Property Rights Management System for the
                University of the Philippines Visayas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
