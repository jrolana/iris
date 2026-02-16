"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchema, UserType } from "@/lib/schemas/user";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { CollegeUnits } from "@/lib/types/college-units";
import Select from "../form/Select";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignUpForm() {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      isExternal: false,
      firstName: "",
      lastName: "",
      email: "",
      role: "techgen",
      college: "",
      collegeName: "",
      isActive: true,
    },
  });

  const isExternal = watch("isExternal");
  const college = watch("college");

  const [isChecked, setIsChecked] = useState(false);

  const collegeOptions = Object.entries(CollegeUnits).map(([_, college]) => {
    return { value: college.toString(), label: college.toString() };
  });

  // new schema
  // college_unit FK NOT NULL,
  // is_external BOOLEAN,
  // college_name TEXT,

  const onSubmit: SubmitHandler<UserType> = async (data) => {
    try {
      UserSchema.parse(data);
      console.log("Form submitted:", data);
    } catch (e) {
      console.error(
        e instanceof Error ? e.message : "There was an error saving this user",
      );
    } finally {
      reset();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
      <div className="overflow-y-scroll">
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Controller
                  name="isExternal"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value || false}
                      onChange={field.onChange}
                      className="h-5 w-5"
                    />
                  )}
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
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        id="firstName"
                        placeholder="Enter your first name"
                        error={errors.firstName ? true : false}
                        hint={errors.firstName ? errors.firstName.message : ""}
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
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        id="lastName"
                        error={errors.lastName ? true : false}
                        hint={errors.lastName ? errors.lastName.message : ""}
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
                    name="collegeName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        value={field.value || ""}
                        onChange={field.onChange}
                        type="text"
                        placeholder="ex. WVSU - Bio"
                        error={errors.collegeName ? true : false}
                        hint={
                          errors.collegeName ? errors.collegeName.message : ""
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
                        name="college"
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            selectedValue={field.value || ""}
                            onChange={field.onChange}
                            options={collegeOptions}
                            placeholder="Select a college"
                          />
                        )}
                      />
                      {errors.college && (
                        <p className="text-error-500 text-xs">
                          {errors.college.message}
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
                        Other Unit
                        <span className="text-error-500">*</span>
                      </Label>
                      <Controller
                        name="collegeName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                            type="text"
                            name="collegeName"
                            placeholder="ex. WVSU - Bio"
                            error={errors.collegeName ? true : false}
                            hint={
                              errors.collegeName
                                ? errors.collegeName.message
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
                  disabled={!isChecked}
                  size="lg"
                  type="submit"
                  className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition"
                >
                  Sign Up
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
