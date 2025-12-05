import GridShape from "@/components/common/GridShape";

// import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        {children}
        <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            {/* <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-4">
                  <Image
                    width={231}
                    height={48}
                    src="./images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Free and Open-Source Tailwind CSS Admin Dashboard Template
                </p>
              </div> */}
            <div className="flex max-w-xs flex-col items-center text-white/90">
              <Link href="/" className="mb-4 block text-center">
                <span className="text-5xl font-extrabold tracking-[0.35em] text-white">
                  IRIS
                </span>
                <div className="mt-1 text-center text-xs leading-4 tracking-wide text-white/70">
                  Intellectual Rights Information System
                </div>
              </Link>

              <p className="text-center text-white/80">
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
