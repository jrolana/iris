"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";

import useAddNewUserModal from "@/hooks/useAddNewUserModal";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useModal } from "@/hooks/useModal";
import SuccessModal from "./SuccessModal";

function AddNewUserModal() {
  const { isOpen, closeModal } = useAddNewUserModal();
  const [email, setEmail] = useState<string>("");
  const successModal = useModal();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // [WIP] will use: apoi | edge function | as is
    // const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

    // if (!error) {
    //   successModal.openModal();
    // }
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
        />
      )}
    </>
  );
}

export default AddNewUserModal;
