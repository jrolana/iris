"use client";

import React, { ReactNode } from "react";
import Modal from "./Modal";
import useEditApplicationDetailsModal from "@/hooks/useEditApplicationDetailsModal";
import { ApplicationType } from "@/lib/types/application";
import EditApplicationDetailsForm from "../application/EditApplicationDetailsForm";

interface EditApplicationDetailsModalProps {
  application: ApplicationType["Row"];
  currentStatusType: string | null;
  ipTitle: string | null;
  ipNumber: string | null;
  filingDate: string | null;
  setIpTitle: React.Dispatch<React.SetStateAction<string | null>>;
  setIpNumber: React.Dispatch<React.SetStateAction<string | null>>;
  setFilingDate: React.Dispatch<React.SetStateAction<string | null>>;
}

function EditApplicationDetailsModal(
  props: EditApplicationDetailsModalProps,
) {
  const {
    application,
    currentStatusType,
    ipTitle,
    ipNumber,
    filingDate,
    setIpTitle,
    setIpNumber,
    setFilingDate,
  } = props;

  if (!application) {
    return (
      <ModalContainer>
        <div>No application selected.</div>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer>
      <EditApplicationDetailsForm
        application={application}
        currentStatusType={currentStatusType}
        ipTitle={ipTitle}
        ipNumber={ipNumber}
        filingDate={filingDate}
        setIpTitle={setIpTitle}
        setIpNumber={setIpNumber}
        setFilingDate={setFilingDate}
      />
    </ModalContainer>
  );
}

export default EditApplicationDetailsModal;

interface ModalContainerProps {
  children: ReactNode;
}

function ModalContainer(props: ModalContainerProps) {
  const { children } = props;
  const { isOpen, closeModal } = useEditApplicationDetailsModal();

  if (!isOpen) return null;

  return (
    <Modal
      title="Edit application details"
      description=""
      isOpen={isOpen}
      onChange={closeModal}
    >
      {children}
    </Modal>
  );
}
