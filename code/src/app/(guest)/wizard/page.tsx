"use client";

import PublicWizard from "@/components/application/PublicWizard";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PublicWizardPage() {
  const router = useRouter();
  return (
    <div className="relative mx-auto w-full max-w-6xl space-y-6 px-4 py-8">
      <button
        onClick={() => router.back()}
        aria-label="Return to previous page"
        className="absolute top-8 left-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 focus:outline-none"
      >
        <ArrowLeft size={18} className="text-slate-700" />
      </button>

      <header className="flex flex-col items-start justify-between gap-4 pl-12 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            IP Application Guide
          </h1>
          <p className="mt-1 text-lg text-slate-500">
            Follow this guide to know which IP application type is right for
            you.
          </p>
        </div>
      </header>

      <main className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mt-4 border-slate-100 pt-2">
            <PublicWizard />
          </div>
        </section>
      </main>
    </div>
  );
}
