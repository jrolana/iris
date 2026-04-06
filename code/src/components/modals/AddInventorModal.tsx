import { useEffect, useState } from "react";
import { CollegeUnits, CollegeUnitType } from "@/lib/types/college-units";
import useAddInventorsModal from "@/hooks/useAddInventorModal";

import Modal from "./Modal";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import Checkbox from "@/components/form/input/Checkbox";
import { InventorType } from "@/lib/types/application";

export default function AddInventorModal() {
  const { isOpen, setNewInventorDetails, closeModal } = useAddInventorsModal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeUnit, setCollegeUnit] = useState<CollegeUnitType | null>();
  const [otherCollegeUnit, setOtherCollegeUnit] = useState<string | null>();
  const [isExternal, setIsExternal] = useState(false);
  const [externalInstitution, setExternalInstitution] = useState<
    string | null
  >();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collegeOptions = Object.entries(CollegeUnits).map(([_, college]) => {
    return { value: college.toString(), label: college.toString() };
  });

  const otherCollegeUnitTernary =
    collegeUnit == CollegeUnits.Other ? !otherCollegeUnit : !collegeUnit;

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
      college_code: isExternal ? "Other" : collegeUnit,
      // forced to be null instead of empty string for db constraints
      other_college_name: otherCollegeUnit == "" ? null : otherCollegeUnit,
      external_institution: externalInstitution,
      application_id: "",
    };

    setNewInventorDetails(inventor);
    closeModal();
  }

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setCollegeUnit(null);
      setOtherCollegeUnit("");
    }
  }, [isOpen]);

  return (
    <Modal
      title="Add New Inventor or Collaborator"
      description=""
      isOpen={isOpen}
      onChange={closeModal}
    >
      <div className="flex w-md flex-col gap-2 p-4">
        <span className="text-lg font-medium">Full Name</span>
        <Input
          placeholder="ex. Juan Dela Cruz"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          className="h-10 text-lg!"
          required
        />
        <span className="text-lg font-medium">Email</span>
        <Input
          placeholder="ex. juan.delacruz@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          className="h-10 text-lg!"
          required
        />
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isExternal}
            onChange={setIsExternal}
            className="h-5 w-5"
          />
          <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
            External Collaborator
          </p>
        </div>
        {isExternal ? (
          <>
            <span className="text-lg font-medium">Institution Name</span>
            <Input
              placeholder="ex. WVSU - Bio"
              value={externalInstitution || ""}
              onChange={(e) => setExternalInstitution(e.target.value)}
              className="h-10 text-lg!"
              required
            />
          </>
        ) : (
          <>
            <span className="text-lg font-medium">College Unit</span>
            <Select
              unstyled
              placeholder="Select College Unit"
              options={collegeOptions}
              className="h-10"
              classNames={{
                placeholder: () => "text-lg! text-muted-foreground",
                control: ({ isFocused }) =>
                  `overflow-hidden border rounded-lg px-3 transition-all focus-ring ${isFocused ? "border-gray-400 ring-3 ring-gray-300" : "border-gray-300"}`,
                menu: () =>
                  "bg-white border border-gray-200 mt-2 rounded-lg  space-y-2 overflow-hidden",
                input: () => "text-sm",
                option: ({ isFocused }) =>
                  `px-3 py-2 cursor-pointer ${isFocused ? "bg-blue-100" : "bg-transparent"}`,
              }}
              onChange={(selectedOption) => {
                setCollegeUnit(
                  selectedOption
                    ? (selectedOption.value as CollegeUnitType)
                    : null,
                );
              }}
            />
            {collegeUnit == CollegeUnits.Other && (
              <>
                <span className="text-lg font-medium">College Name</span>
                <Input
                  placeholder="ex. CFOS"
                  value={otherCollegeUnit || ""}
                  onChange={(e) => {
                    setOtherCollegeUnit(e.target.value);
                  }}
                  className="h-10 text-lg!"
                  required
                />
              </>
            )}
          </>
        )}
        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={
            !name ||
            !email ||
            (isExternal ? !externalInstitution : otherCollegeUnitTernary)
          }
          className="mt-1 h-10 border bg-sky-600 hover:bg-sky-600"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
