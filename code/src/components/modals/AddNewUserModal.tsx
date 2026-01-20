"use client";

import React, { useState, useEffect } from "react";
import { IpType, StatusType } from "@/lib/types/ip";
import { getSuggestedDeadline } from "@/lib/helper/get-status-deadline";
import useAddNewUserModal from "@/hooks/useAddNewUserModal";
import { STATUS_LABELS } from "@/lib/helper/status-labels";
import { dummyApplication } from "@/lib/dummy-data/application";

import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import Label from "../form/Label";
import Input from "../form/input/InputField";

// Options for TTBDO modal only
const STATUS_OPTIONS: { value: StatusType; label: string }[] = Object.entries(
  STATUS_LABELS as Record<string, string>,
).map(([value, label]) => ({
  value: value as StatusType,
  label,
}));

const IP_TYPE_OPTIONS: { value: IpType; label: string }[] = [
  { value: "patent", label: "Patent" },
  { value: "utility_model", label: "Utility Model" },
  { value: "industrial_design", label: "Industrial Design" },
  { value: "trademark", label: "Trademark" },
  { value: "copyright", label: "Copyright" },
];

function AddNewUserModal() {
  const { isOpen, closeModal } = useAddNewUserModal();

  // Reset form whenever modal opens or values change
  useEffect(() => {
    if (isOpen) {
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  if (!isOpen) return null;

  function onConfirm(payload: {
    newIpType: IpType;
    newStatusType: StatusType;
    note: string;
    deadline?: Date | null;
  }) {
    // do the actual db changes here

    // also do some admin check here
    // if (!isAdmin) return;

    console.log(payload);

    closeModal();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  function handleChange() {
    closeModal();
  }

  return (
    <Modal
      title="Invite a new user"
      description={""}
      isOpen={isOpen}
      onChange={handleChange}
    >
      <form className="w-[70vw] lg:w-[20vw]">
        <div className="-mt-4">
          <Label>User email</Label>
          <Input type="email" placeholder="username@up.edu.ph" />
        </div>

        <Button
          size="lg"
          onClick={handleSubmit}
          className="bg-brand-500 hover:bg-brand-600 mt-6 w-full"
        >
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}

export default AddNewUserModal;
