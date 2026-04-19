"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserRegistrationSchema,
  UserRegistrationType,
} from "@/lib/schemas/user";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { CollegeUnits } from "@/lib/types/college-units";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddRegistrationRequest } from "@/hooks/registration-request/useAddRegistrationRequest";
import { toast } from "sonner";
import type { z } from "zod";

type SignupFormValues = z.input<typeof UserRegistrationSchema>;

export default function SignUpForm() {
  const [isChecked, setIsChecked] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [skipExternalEffect, setSkipExternalEffect] = useState(false);

  const collegeOptions = Object.values(CollegeUnits).filter(
    (college) => college !== CollegeUnits.Other,
  );

  const sortedCollegeOptions = [...collegeOptions, CollegeUnits.Other].map(
    (college) => {
      return { value: college.toString(), label: college.toString() };
    },
  );

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormValues, unknown, UserRegistrationType>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "techgen",
      college_code: undefined,
      other_college_name: undefined,
      external_institution: undefined,
    },
  });

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

  const { addRegistrationRequest, isLoading } = useAddRegistrationRequest();

  const onSubmit: SubmitHandler<UserRegistrationType> = async (data) => {
    try {
      const userData = {
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        status: data.status,
        college_code:
          data.college_code === CollegeUnits.Other
            ? undefined
            : data.college_code,
        other_college_name: data.other_college_name,
        external_institution: data.external_institution,
      };

      await addRegistrationRequest(
        {
          userData,
        },
        {
          onSuccess: () => {
            toast.success(
              "Registration submitted! You’ll receive an email once your account is approved.",
            );
            setSkipExternalEffect(true); // to stop the useEffect in overwriting reset()
            reset({
              first_name: "",
              last_name: "",
              email: "",
              role: "techgen",
              college_code: undefined,
              other_college_name: undefined,
              external_institution: undefined,
            });
            setIsExternal(false);
            setIsChecked(false);
          },
        },
      );
    } catch (e: any) {
      if (e.type === "supabase") {
        if (["P0001", "P0002", "P0003"].includes(e.code)) {
          toast.error(e.message);
        } else {
          toast.error("Something went wrong, please try again");
        }
      } else {
        toast.error("Check your input and try again");
      }
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
      <div className="w-full pb-8">
        <div className="mb-5 sm:mb-8">
          <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
            Sign Up
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Submit your details to create an account. You’ll receive an email
            once your account is approved and ready to use.
          </p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(onSubmit, () =>
              toast.error("Check your input and try again"),
            )}
          >
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isExternal}
                  onChange={setIsExternal}
                  className="h-5 w-5"
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  I am an External Collaborator
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* <!-- First Name --> */}
                <div className="sm:col-span-1">
                  <Label>
                    First Name<span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        id="first_name"
                        placeholder="Enter your first name"
                        error={errors.first_name ? true : false}
                        hint={
                          errors.first_name ? errors.first_name.message : ""
                        }
                      />
                    )}
                  />
                </div>
                {/* <!-- Last Name --> */}
                <div className="sm:col-span-1">
                  <Label>
                    Last Name<span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        id="last_name"
                        error={errors.last_name ? true : false}
                        hint={errors.last_name ? errors.last_name.message : ""}
                        placeholder="Enter your last name"
                      />
                    )}
                  />
                </div>
              </div>
              {/* <!-- Email --> */}
              <div>
                <Label>
                  Email<span className="text-error-500">*</span>
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      type="email"
                      id="email"
                      error={errors.email ? true : false}
                      hint={errors.email ? errors.email.message : ""}
                      placeholder={
                        isExternal ? "Enter your email" : "user@up.edu.ph"
                      }
                    />
                  )}
                />
              </div>
              {/* College Unit / Institution */}
              {isExternal ? (
                <div>
                  <Label>
                    Institution Name
                    <span className="text-error-500">*</span>
                  </Label>
                  <Controller
                    name="external_institution"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={
                          typeof field.value == "string" ? field.value : ""
                        }
                        name="external_institution"
                        onChange={field.onChange}
                        type="text"
                        placeholder="ex. WVSU - Bio"
                        error={errors.external_institution ? true : false}
                        hint={
                          errors.external_institution
                            ? errors.external_institution.message
                            : ""
                        }
                      />
                    )}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <Label>
                      College<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Controller
                        name="college_code"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            selectedValue={field.value || ""}
                            onChange={field.onChange}
                            options={sortedCollegeOptions}
                            placeholder="Select a college"
                          />
                        )}
                      />
                      {errors.college_code && (
                        <p className="text-error-500 text-xs">
                          {errors.college_code.message}
                        </p>
                      )}
                      <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                  {college == CollegeUnits.Other && (
                    <div>
                      <Label>
                        College Name
                        <span className="text-error-500">*</span>
                      </Label>
                      <Controller
                        name="other_college_name"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                            type="text"
                            name="other_college_name"
                            placeholder="ex. CFOS"
                            error={errors.other_college_name ? true : false}
                            hint={
                              errors.other_college_name
                                ? errors.other_college_name.message
                                : ""
                            }
                          />
                        )}
                      />
                    </div>
                  )}
                </>
              )}
              {/* <!-- Terms and Agreement --> */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="h-5 w-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account means you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Terms and Conditions,
                  </span>{" "}
                  and our{" "}
                  <span className="text-gray-800 dark:text-white">
                    Privacy Policy
                  </span>
                </p>
              </div>
              {/* <!-- Submit --> */}
              <div>
                <Button
                  disabled={!isChecked || isLoading}
                  size="lg"
                  type="submit"
                  className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition"
                >
                  {isLoading ? "Saving..." : "Sign up"}
                </Button>
              </div>
            </div>
          </form>

          <div className="my-5">
            <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
