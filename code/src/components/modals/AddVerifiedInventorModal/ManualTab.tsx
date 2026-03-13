import { useState, useEffect } from "react";
import { CollegeUnitType, CollegeUnits } from "@/lib/types/college-units";
import { InventorType } from "@/lib/types/application";

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

  const otherCollegeUnitTernary =
    collegeUnit === CollegeUnits.Other ? !otherCollegeUnit : !collegeUnit;

  function handleSubmit() {
    if (
      !name ||
      !email ||
      (isExternal ? !externalInstitution : otherCollegeUnitTernary)
    )
      return;

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

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setCollegeUnit("");
      setOtherCollegeUnit("");
      setIsExternal(false);
      setExternalInstitution("");
    }
  }, [isOpen]);

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
          placeholder="ex. juan.delacruz@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 w-full"
          required
        />
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
            onChange={(e) => setExternalInstitution(e.target.value)}
            className="h-10 w-full"
            required
          />
        </div>
      ) : (
        <>
          <div>
            <p className="mb-1 block text-sm font-medium text-slate-700">
              College Unit
            </p>
            <Select
              value={collegeUnit}
              onValueChange={(value) =>
                setCollegeUnit(value as CollegeUnitType)
              }
            >
              <SelectTrigger
                className={`h-10 w-full bg-white ${collegeUnit === "" ? "text-slate-500" : "text-slate-900"}`}
              >
                <SelectValue placeholder="Select College Unit" />
              </SelectTrigger>

              {/* Added position="popper" to force a standard scrollable box without hover-scrolling */}
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
          </div>

          {collegeUnit === CollegeUnits.Other && (
            <div>
              <p className="mb-1 block text-sm font-medium text-slate-700">
                College Name
              </p>
              <Input
                placeholder="ex. CFOS"
                value={otherCollegeUnit}
                onChange={(e) => setOtherCollegeUnit(e.target.value)}
                className="h-10 w-full"
                required
              />
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
        className="mt-4 h-10 w-full bg-sky-600 hover:bg-sky-700"
      >
        Save
      </Button>
    </div>
  );
}
