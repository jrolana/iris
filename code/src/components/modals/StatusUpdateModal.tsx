"use client";

import React, { useEffect } from "react";
import useStatusUpdateModal from "@/hooks/useStatusUpdateModal";
import { useSearchParams } from "next/navigation";
import { useGetAppById } from "@/hooks/applications/useGetApplicationById";

import Modal from "./Modal";

import { useGetApplicationStatuses } from "@/hooks/status/useGetApplicationStatuses";
import StatusUpdateForm from "../admin/StatusUpdateForm";

function StatusUpdateModal() {
  const { isOpen, closeModal } = useStatusUpdateModal();

  useEffect(() => {
    if (!isOpen) return;
  }, [isOpen]);

  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationID") ?? "";

  const { application, isLoading: isGetAppLoading } = useGetAppById({
    appId: applicationId,
  });

  const { statuses: currentStatus, isLoading: isGetStatusLoading } =
    useGetApplicationStatuses({
      applicationId: applicationId,
      isLatest: true,
    });

  if (isGetAppLoading || isGetStatusLoading) {
    return (
      <Modal
        title="Update status and notify record"
        description={""}
        isOpen={isOpen}
        onChange={closeModal}
      >
        <div>Loading...</div>
      </Modal>
    );
  }

  if (!application || !currentStatus) {
    return (
      <Modal
        title="Update status and notify record"
        description={""}
        isOpen={isOpen}
        onChange={closeModal}
      >
        <div>No status.</div>
      </Modal>
    );
  }

  if (!isOpen) return null;

  const status = Array.isArray(currentStatus)
    ? currentStatus[0]
    : currentStatus;

  return (
    <Modal
      title="Update status and notify record"
      description={""}
      isOpen={isOpen}
      onChange={closeModal}
    >
      <StatusUpdateForm
        application={application}
        currentStatus={status ?? "draft_classification"}
        closeModal={closeModal}
      />
    </Modal>
  );
}

export default StatusUpdateModal;
