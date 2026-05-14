"use client";

import { useEffect, useState } from "react";
import { useUpdateRegistrationRequest } from "@/hooks/registration-request/useUpdateRegistrationRequest";
import { inviteUser } from "@/app/actions/invite-user";
import { toSupabaseTimestamp } from "@/lib/helper/format-date";
import { CollegeUnitType } from "@/lib/types/college-units";
import { RoleType } from "@/lib/types/role";
import { filterRegistrationRequests } from "@/lib/helper/filter-users";
import { useGetRegistrationRequests } from "@/hooks/registration-request/useGetRegistrationRequests";
import { RegistrationRequestType } from "@/lib/types/users";
import { useConfirm } from "@/hooks/useConfirm";
import { assertCurrentUserIsAdmin } from "@/services/users/assert-current-user-is-admin";
import { generatePagination } from "@/lib/helper/generate-pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Link from "next/link";
import Button from "../ui/button/Button";
import Badge from "../ui/badge/Badge";
import { ActiveFilters } from "./filter/ActiveFilters";
import { FilterPanel } from "./filter/FilterPanel";
import Modal from "../modals/Modal";
import Label from "../form/Label";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import { toast } from "sonner";
import { FilterIcon, Loader } from "lucide-react";
import { ROLE_OPTIONS } from "@/lib/constants/roles";

type RequestStatusType = "approved" | "rejected" | "pending";

export default function RegistrationRequestsTable() {
  const {
    registrationRequests: usersData,
    isLoading,
    isFetching,
  } = useGetRegistrationRequests();

  const { updateRegistrationRequest } = useUpdateRegistrationRequest();
  const confirm = useConfirm();

  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [nameEmail, setNameEmail] = useState<string>("");
  const [colleges, setColleges] = useState<CollegeUnitType[]>([]);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [statuses, setStatuses] = useState<RequestStatusType[]>([]);
  const [filteredData, setFilteredData] = useState(usersData ?? []);
  const [currentPage, setCurrentPage] = useState(1);

  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null,
  );
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject" | "role" | null
  >(null);
  const [approvalRequest, setApprovalRequest] = useState<
    RegistrationRequestType["Row"] | null
  >(null);
  const [approvalRole, setApprovalRole] = useState<RoleType>("techgen");
  const [rejectionRequest, setRejectionRequest] = useState<
    RegistrationRequestType["Row"] | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionReasonError, setShowRejectionReasonError] =
    useState(false);

  useEffect(() => {
    const filtered = filterRegistrationRequests(usersData || [], {
      nameEmail,
      colleges,
      roles,
      statuses,
    }).sort((a, b) => {
      const aPending = a.status === "pending" ? 0 : 1;
      const bPending = b.status === "pending" ? 0 : 1;
      if (aPending !== bPending) return aPending - bPending;

      return (
        new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [nameEmail, colleges, roles, statuses, usersData]);

  function applyFilters(filters: {
    nameEmail: string;
    statuses: RequestStatusType[];
    colleges: CollegeUnitType[];
    roles: RoleType[];
  }) {
    setNameEmail(filters.nameEmail);
    setColleges(filters.colleges);
    setRoles(filters.roles);
    setStatuses(filters.statuses);
    setCurrentPage(1);
  }

  function handleRemoveFilterTag(type: string, value: string) {
    if (type === "name_email") {
      setNameEmail("");
    } else if (type === "college") {
      setColleges((prev) => prev.filter((c) => c !== value));
    } else if (type === "role") {
      setRoles((prev) => prev.filter((r) => r !== value));
    } else if (type === "status") {
      setStatuses((prev) => prev.filter((s) => s !== value));
    }
    setCurrentPage(1);
  }

  function clearAllFilters() {
    setNameEmail("");
    setStatuses([]);
    setColleges([]);
    setRoles([]);
    setCurrentPage(1);
  }

  function toggleFilterPanel() {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  }

  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  function openApprovalModal(userData: RegistrationRequestType["Row"]) {
    setApprovalRequest(userData);
    setApprovalRole(userData.role);
  }

  function closeApprovalModal() {
    if (processingAction === "approve") return;

    setApprovalRequest(null);
  }

  function openRejectionModal(userData: RegistrationRequestType["Row"]) {
    setRejectionRequest(userData);
    setRejectionReason("");
    setShowRejectionReasonError(false);
  }

  function closeRejectionModal() {
    if (processingAction === "reject") return;

    setRejectionRequest(null);
    setRejectionReason("");
    setShowRejectionReasonError(false);
  }

  async function handleApprove() {
    if (!approvalRequest) return;

    const approvedUserData = {
      ...approvalRequest,
      role: approvalRole,
    };

    try {
      setProcessingRequestId(approvalRequest.id);
      setProcessingAction("approve");

      await assertCurrentUserIsAdmin();

      await updateRegistrationRequest({
        id: approvalRequest.id,
        userData: {
          role: approvalRole,
          rejection_reason: null,
        },
      });

      const inviteResult = await inviteUser({
        email: approvalRequest.email,
        userData: approvedUserData,
      });

      if (!inviteResult.success) {
        toast.error(inviteResult.error);
        return;
      }

      toast.success("Successfully approved the registration request.");

      await updateRegistrationRequest({
        id: approvalRequest.id,
        userData: {
          status: "approved",
          invite_expires_at: toSupabaseTimestamp(
            new Date(Date.now() + 24 * 60 * 60 * 1000),
          ),
        },
      });
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a problem in approving the registration request.",
      );
    } finally {
      setProcessingRequestId(null);
      setProcessingAction(null);
      setApprovalRequest(null);
    }
  }

  async function handleReject() {
    if (!rejectionRequest) return;
    const trimmedReason = rejectionReason.trim();

    if (!trimmedReason) {
      setShowRejectionReasonError(true);
      return;
    }

    try {
      setProcessingRequestId(rejectionRequest.id);
      setProcessingAction("reject");

      await assertCurrentUserIsAdmin();

      await updateRegistrationRequest(
        {
          id: rejectionRequest.id,
          userData: {
            status: "rejected",
            rejection_reason: trimmedReason,
            invite_expires_at: null,
          },
        },
        {
          onSuccess: () => {
            toast.success("Successfully rejected the registration request.");
          },
          onError: () => {
            toast.error(
              "There was a problem rejecting the registration request.",
            );
          },
        },
      );
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a problem in rejecting the registration request.",
      );
    } finally {
      setProcessingRequestId(null);
      setProcessingAction(null);
      setRejectionRequest(null);
      setRejectionReason("");
      setShowRejectionReasonError(false);
    }
  }

  async function handleRequestRoleChange(
    userData: RegistrationRequestType["Row"],
    role: RoleType,
  ) {
    if (role === userData.role) return;

    const isConfirmed = await confirm({
      title: "Confirm Role Change",
      message: `Change ${userData.full_name}'s requested role from ${userData.role} to ${role}?`,
    });

    if (!isConfirmed) return;

    try {
      setProcessingRequestId(userData.id);
      setProcessingAction("role");

      await updateRegistrationRequest({
        id: userData.id,
        userData: { role },
      });

      toast.success("Successfully updated the request role.");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "There was a problem updating the request role.",
      );
    } finally {
      setProcessingRequestId(null);
      setProcessingAction(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:px-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-gray-800">
            User Registration Requests
          </h1>

          {!isLoading && isFetching && (
            <span className="inline-flex items-center gap-2 text-sm text-gray-500">
              <Loader className="animate-spin text-gray-500" size={16} />
              Refreshing...
            </span>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col justify-start gap-2 sm:flex-row sm:items-center">
        <Button
          variant="outline"
          startIcon={<FilterIcon size={18} />}
          disabled={isLoading}
          onClick={toggleFilterPanel}
          className="h-12 max-w-fit"
        >
          {isFilterPanelOpen ? "Close Filters" : "Filter"}
        </Button>
      </div>

      <FilterPanel
        isOpen={isFilterPanelOpen}
        isForUserRequests={true}
        onApplyFilters={applyFilters}
        onClose={() => setIsFilterPanelOpen(false)}
        currentFilters={{
          nameEmail,
          statuses: statuses.length > 0 ? statuses : [],
          colleges,
          roles,
        }}
      />

      <ActiveFilters
        name_email={nameEmail}
        status={statuses}
        colleges={colleges}
        roles={roles}
        onRemove={handleRemoveFilterTag}
        onClearAll={clearAllFilters}
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex h-60 items-center justify-center gap-2 py-5 text-gray-500">
            <span>Fetching user requests...</span>
            <Loader className="animate-spin text-gray-500" size={18} />
          </div>
        ) : (
          <div className="relative">
            {!isLoading && isFetching && (
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden rounded-full bg-transparent">
                <div className="h-full w-full animate-pulse bg-gray-300" />
              </div>
            )}

            <Table>
              <TableHeader className="border-y border-gray-100">
                <TableRow>
                  {[
                    "Full Name",
                    "Email",
                    "College",
                    "Role",
                    "Status",
                    "Rejection Reason",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      isHeader
                      className="text-theme-xs p-2 py-3 text-start font-medium text-gray-500"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100">
                {currentRecords?.length === 0 && (
                  <TableRow>
                    <TableCell
                      className="text-theme-sm p-2 py-10 text-center text-gray-500"
                      colSpan={10}
                    >
                      No user requests found.
                    </TableCell>
                  </TableRow>
                )}

                {currentRecords.map((record) => {
                  const isThisRowProcessing = processingRequestId === record.id;
                  const isApprovingThisRow =
                    isThisRowProcessing && processingAction === "approve";
                  const isRejectingThisRow =
                    isThisRowProcessing && processingAction === "reject";
                  const isUpdatingRoleThisRow =
                    isThisRowProcessing && processingAction === "role";

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        <Link href={"/"} className="hover:text-brand-500">
                          {record.full_name}
                        </Link>
                      </TableCell>

                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        {record.email}
                      </TableCell>

                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        {record.college_code ??
                          record.other_college_name ??
                          record.external_institution}
                      </TableCell>

                      <TableCell className="text-theme-sm min-w-44 p-2 py-3 text-gray-800">
                        <Select
                          selectedValue={record.role}
                          defaultValue={record.role}
                          options={ROLE_OPTIONS}
                          disabled={
                            record.status !== "pending" ||
                            isThisRowProcessing ||
                            isFetching
                          }
                          onChange={(value) =>
                            handleRequestRoleChange(record, value as RoleType)
                          }
                          className="h-9 py-2"
                        />
                        {isUpdatingRoleThisRow && (
                          <span className="mt-1 block text-xs text-gray-500">
                            Updating role...
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        <Badge
                          color={
                            record.status == "pending"
                              ? "warning"
                              : record.status == "approved"
                                ? "success"
                                : "error"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-theme-sm max-w-72 p-2 py-3 text-gray-800">
                        <span className="line-clamp-3">
                          {record.rejection_reason || "-"}
                        </span>
                      </TableCell>

                      <TableCell className="text-theme-sm p-2 py-3 text-gray-800">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            disabled={
                              record.status !== "pending" ||
                              isThisRowProcessing ||
                              isFetching
                            }
                            onClick={() => {
                              openApprovalModal(record);
                            }}
                            className="h-8"
                          >
                            {isApprovingThisRow ? "Approving..." : "Approve"}
                          </Button>

                          <Button
                            size="sm"
                            variant="danger"
                            disabled={
                              record.status !== "pending" ||
                              isThisRowProcessing ||
                              isFetching
                            }
                            onClick={() => {
                              openRejectionModal(record);
                            }}
                            className="h-8"
                          >
                            {isRejectingThisRow ? "Rejecting..." : "Reject"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <hr className="border border-gray-100" />

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading || isFetching}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {generatePagination(currentPage, totalPages).map((page, i) =>
            page === "..." ? (
              <span
                key={`ellipsis-${i}-${page}`}
                className="flex h-8 w-8 items-center justify-center text-sm text-gray-500"
              >
                ...
              </span>
            ) : (
              <Button
                key={`page-${i}-${page}`}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page as number)}
                disabled={isLoading || isFetching}
              >
                {page}
              </Button>
            ),
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading || isFetching}
        >
          Next
        </Button>
      </div>

      {approvalRequest && (
        <Modal
          title="Confirm Approval"
          description={`Are you sure you want to approve the registration request of ${approvalRequest.full_name}? Review the user's role before sending the invitation.`}
          isOpen={Boolean(approvalRequest)}
          onChange={closeApprovalModal}
          layer={1}
          descriptionWidth="max-w-lg"
        >
          <div className="w-full max-w-lg min-w-[85vw] px-0 sm:min-w-[400px] sm:px-10">
            <div className="mb-5 text-left">
              <Label htmlFor="approval-role">User role</Label>
              <Select
                selectedValue={approvalRole}
                defaultValue={approvalRole}
                options={ROLE_OPTIONS}
                disabled={processingAction === "approve"}
                onChange={(value) => setApprovalRole(value as RoleType)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={closeApprovalModal}
                disabled={processingAction === "approve"}
              >
                Cancel
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleApprove}
                disabled={processingAction === "approve"}
              >
                {processingAction === "approve" ? "Approving..." : "Approve"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {rejectionRequest && (
        <Modal
          title="Confirm Rejection"
          description={`Are you sure you want to reject the registration request of ${rejectionRequest.full_name}? Provide the reason before continuing.`}
          isOpen={Boolean(rejectionRequest)}
          onChange={closeRejectionModal}
          layer={1}
          descriptionWidth="max-w-2xl"
        >
          <div className="w-full max-w-2xl min-w-[85vw] px-0 sm:min-w-[640px] sm:px-10">
            <div className="mb-5 text-left">
              <Label htmlFor="rejection-reason">Reason for rejection</Label>
              <TextArea
                value={rejectionReason}
                rows={4}
                disabled={processingAction === "reject"}
                error={showRejectionReasonError}
                hint={
                  showRejectionReasonError
                    ? "Please provide a reason for rejection."
                    : ""
                }
                placeholder="Explain why this request is being rejected."
                className="min-h-32"
                onChange={(value) => {
                  setRejectionReason(value);
                  if (value.trim()) setShowRejectionReasonError(false);
                }}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={closeRejectionModal}
                disabled={processingAction === "reject"}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleReject}
                disabled={processingAction === "reject"}
              >
                {processingAction === "reject" ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
