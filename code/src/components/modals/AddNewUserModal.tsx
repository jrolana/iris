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

function AddNewUserModal() {
  const { isOpen, closeModal } = useAddNewUserModal();
  const successModal = useModal();
  const errorModal = useModal();
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await inviteUser(email);

    if (result.success) {
      setSuccessMessage(
        "The user has been invited and will receive an email shortly.",
      );
      successModal.openModal();
    } else {
      setErrorMessage(result.error);
      errorModal.openModal();
    }

    closeModal();
  };

  return (
    <>
      {isOpen && (
        <Modal
          title="Invite a new user"
          description={""}
          isOpen={isOpen}
          onChange={closeModal}
        >
          <form onSubmit={handleSubmit} className="w-[70vw] lg:w-[20vw]">
            <div className="-mt-4">
              <Label>User email</Label>
              <Input
                type="email"
                placeholder="username@up.edu.ph"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <Button
              size="lg"
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 mt-6 w-full"
            >
              Save Changes
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
          }}
          message={errorMessage}
        />
      )}
    </>
  );
}

export default AddNewUserModal;
