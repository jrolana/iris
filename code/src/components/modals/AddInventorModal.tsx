import { useEffect, useState } from "react";
import { CollegeUnits, CollegeUnitType } from "@/lib/types/college-units";
import useAddInventorsModal from "@/hooks/useAddInventorModal";

import Modal from "./Modal";
import { Input } from "../ui/input";
import { Button } from "@/components/ui/button";
import Select from "react-select";

export default function AddInventorModal() {
  const { isOpen, setNewInventorDetails, closeModal } = useAddInventorsModal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeUnit, setCollegeUnit] = useState<CollegeUnitType | null>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const collegeOptions = Object.entries(CollegeUnits).map(([_, college]) => {
    return { value: college.toString(), label: college.toString() };
  });

  function handleSubmit() {
    if (!name || !email || !collegeUnit) return;
    setNewInventorDetails({
      comments: null,
      full_name: name,
      email: email,
      college: collegeUnit,
      application_id: "",
    });

    closeModal();
  }

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setEmail("");
      setCollegeUnit(null);
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
              selectedOption ? (selectedOption.value as CollegeUnitType) : null,
            );
          }}
        />

        <Button
          onClick={handleSubmit}
          type="submit"
          disabled={!name || !email || !collegeUnit}
          className="mt-1 h-10 border bg-sky-600 hover:bg-sky-600"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
