import { useState, useEffect } from "react";
import { CollegeUnitType, CollegeUnits } from "@/lib/types/college-units";
import { InventorType } from "@/lib/types/application";
import { LinkUserSchema } from "@/lib/schemas/user"; // Adjust this import path if needed

import { Input } from "../../ui/input";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/form/input/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const collegeOptions = Object.entries(CollegeUnits).map(([_, college]) => {
  return { value: college, label: college };
});

interface ManualTabProps {
  isOpen: boolean;
  setInventor: (inventor: InventorType["Insert"]) => void;
  closeModal: () => void;
}

export function ManualTab(props: ManualTabProps) {
  const { isOpen, setInventor, closeModal } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeUnit, setCollegeUnit] = useState<CollegeUnitType | "">("");
  const [otherCollegeUnit, setOtherCollegeUnit] = useState<string>("");
  const [isExternal, setIsExternal] = useState(false);
  const [externalInstitution, setExternalInstitution] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const otherCollegeUnitTernary =
    collegeUnit === CollegeUnits.Other ? !otherCollegeUnit : !collegeUnit;

  function handleSubmit() {
    setErrors({}); // clear previous errors

    let otherCollegeName = undefined;
    if (!isExternal && otherCollegeUnit !== "") {
      otherCollegeName = otherCollegeUnit;
    }

    let externalInstitutionValue = undefined;
    if (isExternal && externalInstitution !== "") {
      externalInstitutionValue = externalInstitution;
    }
    const payload = {
      email,
      college_code: isExternal ? undefined : collegeUnit,
      other_college_name: otherCollegeName,
      external_institution: externalInstitutionValue,
    };

    // Zod validation
    const validation = LinkUserSchema.safeParse(payload);

    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};

      validation.error.issues.forEach((issue) => {
        const key = issue.path[0]?.toString();
        if (key) {
          formattedErrors[key] = issue.message;
        }
      });

      setErrors(formattedErrors);
      return;
    }

    if (!name) return;

    // passed validation beyond here
    const inventor: InventorType["Insert"] = {
      comments: null,
      full_name: name,
      email: email,
      college_code: isExternal ? "Other" : (collegeUnit as CollegeUnitType),
      other_college_name: otherCollegeUnit === "" ? null : otherCollegeUnit,
      external_institution:
        externalInstitution === "" ? null : externalInstitution,
      application_id: "",
    };

    setInventor(inventor);
    closeModal();
  }

  // reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setCollegeUnit("");
      setOtherCollegeUnit("");
      setIsExternal(false);
      setExternalInstitution("");
      setErrors({});
    }
  }, [isOpen]);

  // clear relevant errors when toggling external status
  useEffect(() => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.externalInstitution;
      delete newErrors.otherCollegeName;
      // re-trigger email validation visually if there's an existing email error
      if (newErrors.email) delete newErrors.email;
      return newErrors;
    });
  }, [isExternal]);

  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <p className="mb-1 block text-sm font-medium text-slate-700">
          Full Name
        </p>
        <Input
          placeholder="ex. Juan Dela Cruz"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full"
          required
        />
      </div>

      <div>
        <p className="mb-1 block text-sm font-medium text-slate-700">Email</p>
        <Input
          placeholder={
            isExternal ? "ex. juan.delacruz@example.com" : "user@up.edu.ph"
          }
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          className={`h-10 w-full ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          required
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="flex items-center gap-3 py-1">
        <Checkbox
          checked={isExternal}
          onChange={setIsExternal}
          className="h-5 w-5 shrink-0"
        />
        <p className="font-medium text-slate-600">External Collaborator</p>
      </div>

      {isExternal ? (
        <div>
          <p className="mb-1 block text-sm font-medium text-slate-700">
            Institution Name
          </p>
          <Input
            placeholder="ex. WVSU - Bio"
            value={externalInstitution}
            onChange={(e) => {
              setExternalInstitution(e.target.value);
              if (errors.externalInstitution)
                setErrors({ ...errors, externalInstitution: "" });
            }}
            className={`h-10 w-full ${errors.externalInstitution ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            required
          />
          {errors.externalInstitution && (
            <p className="mt-1 text-xs text-red-500">
              {errors.externalInstitution}
            </p>
          )}
        </div>
      ) : (
        <>
          <div>
            <p className="mb-1 block text-sm font-medium text-slate-700">
              College Unit
            </p>
            <Select
              value={collegeUnit}
              onValueChange={(value) => {
                setCollegeUnit(value as CollegeUnitType);
                if (errors.college_code)
                  setErrors({ ...errors, college_code: "" });
              }}
            >
              <SelectTrigger
                className={`h-10 w-full bg-white ${collegeUnit === "" ? "text-slate-500" : "text-slate-900"} ${errors.college_code ? "border-red-500 ring-1 ring-red-500" : ""}`}
              >
                <SelectValue placeholder="Select College Unit" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                side="bottom"
                className="z-9999 max-h-60 overflow-y-auto"
              >
                {collegeOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.college_code && (
              <p className="mt-1 text-xs text-red-500">{errors.college_code}</p>
            )}
          </div>

          {collegeUnit === CollegeUnits.Other && (
            <div>
              <p className="mb-1 block text-sm font-medium text-slate-700">
                College Name
              </p>
              <Input
                placeholder="ex. CFOS"
                value={otherCollegeUnit}
                onChange={(e) => {
                  setOtherCollegeUnit(e.target.value);
                  if (errors.otherCollegeName)
                    setErrors({ ...errors, otherCollegeName: "" });
                }}
                className={`h-10 w-full ${errors.otherCollegeName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
              />
              {errors.otherCollegeName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.otherCollegeName}
                </p>
              )}
            </div>
          )}
        </>
      )}

      <Button
        onClick={handleSubmit}
        type="button"
        disabled={
          !name ||
          !email ||
          (isExternal ? !externalInstitution : otherCollegeUnitTernary)
        }
        className="mt-4 h-10 w-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300"
      >
        Save
      </Button>
    </div>
  );
}
