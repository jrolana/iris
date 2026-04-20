"use client";

import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

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
import {
  UserRegistrationSchema,
  UserRegistrationType,
} from "@/lib/schemas/user";
import { useConfirm } from "@/hooks/useConfirm";
import { ROLE_OPTIONS } from "@/lib/constants/roles";
import { CollegeUnits } from "@/lib/types/college-units";
import Checkbox from "../form/input/Checkbox";

type InviteFormValues = z.input<typeof UserRegistrationSchema>;

const defaultFormValues: InviteFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  role: "techgen",
  college_code: undefined,
  other_college_name: undefined,
  external_institution: undefined,
};

function AddNewUserModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [skipExternalEffect, setSkipExternalEffect] = useState(false);

  const { isOpen, closeModal } = useAddNewUserModal();
  const successModal = useModal();
  const errorModal = useModal();
  const confirm = useConfirm();

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const collegeOptions = [
    ...Object.values(CollegeUnits).filter(
      (college) => college !== CollegeUnits.Other,
    ),
    CollegeUnits.Other,
  ].map((college) => ({
      value: college.toString(),
      label: college.toString(),
    }));

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteFormValues, unknown, UserRegistrationType>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: defaultFormValues,
  });

  const email = watch("email");
  const role = watch("role");
  const college = watch("college_code");

  useEffect(() => {
    if (skipExternalEffect) {
      setSkipExternalEffect(false);
      return;
    }

    if (isExternal) {
      reset({
        ...watch(),
        college_code: undefined,
        other_college_name: undefined,
        external_institution: "",
      });
    } else {
      reset({
        ...watch(),
        external_institution: undefined,
      });
    }
  }, [isExternal]);

  function resetForm() {
    setSkipExternalEffect(true);
    reset(defaultFormValues);
    setIsExternal(false);
  }

  const onSubmit: SubmitHandler<UserRegistrationType> = async (data) => {
    const isConfirmed = await confirm({
      title: "Confirm Invitation",
      message: `Are you sure you want to invite ${data.email} as ${data.role}?`,
    });

    if (!isConfirmed) return;

    setIsLoading(true);

    const userData = {
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      college_code:
        data.college_code === CollegeUnits.Other
          ? undefined
          : data.college_code,
      other_college_name: data.other_college_name,
      external_institution: data.external_institution,
    };

    try {
      const inviteResult = await inviteUser({
        email: data.email,
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-[80vw] lg:w-[26vw]"
          >
            <div className="-mt-4 space-y-2">
              <div>
                <Label>First name</Label>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      type="text"
                      placeholder="Juan"
                      error={Boolean(errors.first_name)}
                      hint={errors.first_name?.message ?? ""}
                    />
                  )}
                />
              </div>

              <div>
                <Label>Last name</Label>
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      type="text"
                      placeholder="Dela Cruz"
                      error={Boolean(errors.last_name)}
                      hint={errors.last_name?.message ?? ""}
                    />
                  )}
                />
              </div>

              <div>
                <Label>User email</Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      type="email"
                      placeholder={
                        isExternal ? "Enter email" : "user@up.edu.ph"
                      }
                      error={Boolean(errors.email)}
                      hint={errors.email?.message ?? ""}
                    />
                  )}
                />
              </div>

              <div className="relative">
                <Label>User role</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      selectedValue={field.value || ""}
                      options={ROLE_OPTIONS}
                      onChange={field.onChange}
                      placeholder="Select a role"
                    />
                  )}
                />
                <span className="pointer-events-none absolute top-9 right-3 text-gray-500 dark:text-gray-400">
                  <ChevronDownIcon />
                </span>
                {errors.role && (
                  <p className="text-error-500 mt-1.5 text-xs">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <Checkbox
                checked={isExternal}
                onChange={setIsExternal}
                label="External user"
              />

              {isExternal ? (
                <div>
                  <Label>Institution name</Label>
                  <Controller
                    name="external_institution"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={
                          typeof field.value === "string" ? field.value : ""
                        }
                        onChange={field.onChange}
                        type="text"
                        placeholder="ex. WVSU - Bio"
                        error={Boolean(errors.external_institution)}
                        hint={errors.external_institution?.message ?? ""}
                      />
                    )}
                  />
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Label>College</Label>
                    <Controller
                      name="college_code"
                      control={control}
                      render={({ field }) => (
                        <Select
                          selectedValue={field.value || ""}
                          onChange={field.onChange}
                          options={collegeOptions}
                          placeholder="Select a college"
                        />
                      )}
                    />
                    <span className="pointer-events-none absolute top-9 right-3 text-gray-500 dark:text-gray-400">
                      <ChevronDownIcon />
                    </span>
                    {errors.college_code && (
                      <p className="text-error-500 mt-1.5 text-xs">
                        {errors.college_code.message}
                      </p>
                    )}
                  </div>

                  {college === CollegeUnits.Other && (
                    <div>
                      <Label>College name</Label>
                      <Controller
                        name="other_college_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                            type="text"
                            placeholder="ex. College of Medicine"
                            error={Boolean(errors.other_college_name)}
                            hint={errors.other_college_name?.message ?? ""}
                          />
                        )}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <Button
              size="lg"
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 mt-4 w-full"
              disabled={!email || !role || isLoading}
            >
              {isLoading ? "Sending Invitation..." : "Send Invitation"}
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
