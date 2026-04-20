"use client";

import Button from "../ui/button/Button";

interface PropsInterface {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  showSecondaryButton?: boolean;
}

const CallToAction = (props: PropsInterface) => {
  const {
    title = "Protect & Manage Your Ideas",
    description = "Apply, track, and manage your IP easily",
    primaryLabel = "Submit a New IP Application",
    primaryHref = "/techgen/new-application",
  } = props;

  return (
    <div className="shadow-default text-brand space-y-4 rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-11 sm:px-6 sm:pt-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <Button
        size="md"
        variant="primary"
        onClick={() => {
          window.location.href = primaryHref;
        }}
        className="w-full flex-1"
      >
        {primaryLabel}
      </Button>
    </div>
  );
};

export default CallToAction;
