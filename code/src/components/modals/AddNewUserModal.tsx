"use client";

import React, { useState } from "react";

import useAddNewUserModal from "@/hooks/useAddNewUserModal";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import { inviteUser } from "@/app/actions/invite-user";
import Select from "../form/Select";
import { ChevronDownIcon } from "lucide-react";
import { UserSchema } from "@/lib/schemas/user";
import { useConfirm } from "@/hooks/useConfirm";
import { ROLE_OPTIONS } from "@/lib/constants/roles";

function AddNewUserModal() {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, closeModal } = useAddNewUserModal();
  const successModal = useModal();
  const errorModal = useModal();
  const confirm = useConfirm();

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [role, setRole] = useState<string>("");
  const [isRoleValid, setIsRoleValid] = useState(true);

  function resetForm() {
    setEmail("");
    setRole("");
    setIsEmailValid(true);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isConfirmed = await confirm({
      title: "Confirm Invitation",
      message: `Are you sure you want to invite ${email} as ${role}?`,
    });
    if (!isConfirmed) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const userData = {
      email,
      role: role as "admin" | "techgen" | "up-official",
    };

    try {
      const inviteResult = await inviteUser({
        email,
        userData,
      });

      if (!inviteResult.success) {
        setErrorMessage(inviteResult.error);
        errorModal.openModal();
        return;
      }

      setSuccessMessage(
        "The user has been invited and will receive an email shortly.",
      );
      successModal.openModal();
    } catch (e) {
      setErrorMessage(
        e instanceof Error
          ? e.message
          : "There was a problem inviting the user.",
      );
      errorModal.openModal();
    } finally {
      setIsLoading(false);
      closeModal();
      resetForm();
    }
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
    setIsRoleValid(roleValidation.success);
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
          layer={0}
        >
          <form onSubmit={handleSubmit} className="w-[70vw] lg:w-[20vw]">
            <div className="-mt-4 space-y-2">
              <Label>User email</Label>
              <Input
                type="email"
                value={email}
                defaultValue={email}
                placeholder="username@up.edu.ph"
                onChange={handleEmailChange}
                error={!isEmailValid}
                hint={isEmailValid ? "" : "Email must be a UP mail address."}
              />
              <div className="relative">
                <Select
                  selectedValue={role}
                  options={ROLE_OPTIONS}
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
