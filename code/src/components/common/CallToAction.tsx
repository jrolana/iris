"use client";

import Button from "../ui/button/Button";
import React from "react";

interface propsInterface {
  isApplicant?: boolean;
}

const CallToAction = (props: propsInterface) => {
  const { isApplicant = true } = props;

  return (
    <div className="shadow-default text-brand space-y-4 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
      <h2 className="text-xl font-semibold">Protect & Manage Your Ideas</h2>
      <p className="text-gray-600">
        {isApplicant
          ? "Apply, track, and manage your IP easily"
          : "Start protecting your ideas today"}
      </p>

      <div className="flex flex-col gap-4">
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            window.location.href = "/apply-ip";
          }}
          className="flex-1"
        >
          {isApplicant
            ? "Submit a New IP Application"
            : "Apply for IP Protection"}
        </Button>

        {isApplicant && (
          <Button
            size="md"
            variant="outline"
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex-1"
          >
            Track Your Latest IP Application
          </Button>
        )}
      </div>
    </div>
  );
};

export default CallToAction;
