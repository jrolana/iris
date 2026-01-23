"use client";

import React, { useState, useEffect } from "react";

import useAddNewUserModal from "@/hooks/useAddNewUserModal";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import { inviteUser } from "@/app/app/actions/invite-user";
import Select, { Option } from "../form/Select";
import { ChevronDownIcon } from "lucide-react";
import { UserSchema, InviteUserType } from "@/lib/schemas/user";

function AddNewUserModal() {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, closeModal } = useAddNewUserModal();
  const successModal = useModal();
  const errorModal = useModal();

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [role, setRole] = useState<string>("");
  const [isRoleValid, setIsRoleValid] = useState(true);

  const roles: Option[] = [
    { value: "admin", label: "Admin" },
    { value: "techgen", label: "Techgen" },
    { value: "up-official", label: "UP Official" },
  ];

  function resetForm() {
    setEmail("");
    setRole("");
    setIsEmailValid(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await inviteUser({
      email,
      role: role as "admin" | "techgen" | "up-official",
    });

    if (result.success) {
      setSuccessMessage(
        "The user has been invited and will receive an email shortly.",
      );
      successModal.openModal();
    } else {
      setErrorMessage(result.error);
      errorModal.openModal();
    }

    setIsLoading(false);
    closeModal();
    resetForm();
  };

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailValidation = UserSchema.shape.email.safeParse(newEmail);
    setIsEmailValid(emailValidation.success);
  }

  function handleRoleChange(val: string) {
    setRole(val);
    const roleValidation = UserSchema.shape.role.safeParse(val);
    setIsEmailValid(roleValidation.success);
  }

  return (
    <>
      {isOpen && (
        <Modal
          title="Invite a new user"
          description={""}
          isOpen={isOpen}
          onChange={() => {
            closeModal();
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} className="w-[70vw] lg:w-[20vw]">
            <div className="-mt-4 space-y-2">
              <Label>User email</Label>
              <Input
                type="email"
                defaultValue={email}
                placeholder="username@up.edu.ph"
                onChange={handleEmailChange}
                error={!isEmailValid}
                hint={isEmailValid ? "" : "Email must be a UP mail address."}
              />
              <div className="relative">
                <Select
                  options={roles}
                  defaultValue={role}
                  onChange={handleRoleChange}
                  placeholder="Select a role"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
                {!isRoleValid && (
                  <p className="text-error-500 mt-1.5 text-xs">
                    Please select a role.
                  </p>
                )}
              </div>
            </div>

            <Button
              size="lg"
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 mt-4 w-full"
              disabled={!email || !role || isLoading}
            >
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </form>
        </Modal>
      )}
      {successModal.isOpen && (
        <SuccessModal
          isOpen={successModal.isOpen}
          onClose={() => {
            successModal.closeModal();
            closeModal();
            resetForm();
          }}
          message={successMessage}
        />
      )}
      {errorModal.isOpen && (
        <ErrorModal
          isOpen={errorModal.isOpen}
          onClose={() => {
            errorModal.closeModal();
            closeModal();
            resetForm();
          }}
          message={errorMessage}
        />
      )}
    </>
  );
}

export default AddNewUserModal;
