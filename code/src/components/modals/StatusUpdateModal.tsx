"use client";
import React, { ReactNode, useEffect } from "react";
import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";
import { useSearchParams } from "next/navigation";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";
import Modal from "./Modal";
import { useGetApplicationStatuses } from "@/hooks/status/useGetApplicationStatuses";
import StatusUpdateForm from "../admin/StatusUpdateForm";

function StatusUpdateModal() {
  const { closeModal } = useStatusUpdateModal();

  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationID") || null;

  const { application, isLoading: isGetAppLoading } = useGetAppById({
    appId: applicationId || "",
  });

  const { statuses: currentStatus, isLoading: isGetStatusLoading } =
    useGetApplicationStatuses({
      applicationId: applicationId || "",
      isLatest: true,
    });

  if (!applicationId) {
    return (
      <ModalContainer>
        <div>No application selected.</div>
      </ModalContainer>
    );
  }

  if (isGetAppLoading || isGetStatusLoading) {
    return (
      <ModalContainer>
        <div>Loading...</div>
      </ModalContainer>
    );
  }

  if (!application || !currentStatus) {
    return (
      <ModalContainer>
        <div>No status.</div>
      </ModalContainer>
    );
  }

  const status = Array.isArray(currentStatus)
    ? currentStatus[0]
    : currentStatus;

  return (
    <ModalContainer>
      <StatusUpdateForm
        application={application}
        currentStatus={status ?? "draft_classification"}
        closeModal={closeModal}
      />
    </ModalContainer>
  );
}

export default StatusUpdateModal;

interface PropsInterface {
  children: ReactNode;
}
function ModalContainer(props: PropsInterface) {
  const { children } = props;
  const { isOpen, closeModal } = useStatusUpdateModal();

  if (!isOpen) return null;

  return (
    <Modal
      title="Update status and notify record"
      description=""
      isOpen={isOpen}
      onChange={closeModal}
    >
      {children}
    </Modal>
  );
}
