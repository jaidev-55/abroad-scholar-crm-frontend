import React, { useEffect, useState } from "react";
import { Drawer, Tabs, Spin } from "antd";
import {
  RiCloseLine,
  RiUserLine,
  RiPassportLine,
  RiFolder3Line,
  RiFlightTakeoffLine,
  RiHandCoinLine,
} from "react-icons/ri";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import type { EnrolledStudent } from "../Types";
import {
  getEnrolledById,
  updateEnrolledStage,
  upsertVisaDetail,
  type EnrollmentStage,
  type UpdateVisaDetailPayload,
} from "../api/ Enrolledapi";

import StudentOverviewCard from "./StudentOverviewCard";
import AdmissionTimeline from "./AdmissionTimeline";
import FeePaymentSection from "./FeePaymentSection";
import VisaSection from "./VisaSection";
import DocumentSection from "./DocumentSection";
import PreDepartureChecklist from "./PreDepartureChecklist";
import CommissionSection from "./CommissionSection";
import { getIsAdmin } from "../../../utils/getStoredUser";

interface StudentDetailDrawerProps {
  open: boolean;
  student: EnrolledStudent | null;
  onClose: () => void;
  onStudentUpdated: (updated: EnrolledStudent) => void;
}

const StudentDetailDrawer: React.FC<StudentDetailDrawerProps> = ({
  open,
  student,
  onClose,
  onStudentUpdated,
}) => {
  const queryClient = useQueryClient();

  const isAdmin = getIsAdmin();

  const [detail, setDetail] = useState<EnrolledStudent | null>(null);
  const detailLoading =
    open && !!student && (!detail || detail.id !== student.id);

  const studentId = student?.id ?? null;

  useEffect(() => {
    if (!open || !studentId) return;

    let cancelled = false;

    getEnrolledById(studentId)
      .then((full) => {
        if (!cancelled) setDetail(full);
      })
      .catch(() => {
        if (!cancelled) message.error("Failed to load student details");
      });

    return () => {
      cancelled = true;
      setDetail(null);
    };
  }, [open, studentId]);

  const handleStageChange = async (
    newStage: EnrollmentStage,
    note?: string,
  ) => {
    if (!detail) return;
    try {
      const updated = await updateEnrolledStage(detail.id, newStage, note);
      const refreshed = await getEnrolledById(detail.id);
      setDetail(refreshed);
      onStudentUpdated(updated);
      queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
      message.success("Stage updated");
    } catch {
      message.error("Failed to update stage");
    }
  };

  const handleVisaUpdate = async (payload: UpdateVisaDetailPayload) => {
    if (!detail) return;
    try {
      await upsertVisaDetail(detail.id, payload);
      const refreshed = await getEnrolledById(detail.id);
      setDetail(refreshed);
      onStudentUpdated(refreshed);
      message.success("Visa details saved");
    } catch {
      message.error("Failed to save visa details");
    }
  };

  // Callback child sections use after any mutation to refresh
  const handleRefresh = async () => {
    if (!detail) return;
    try {
      const refreshed = await getEnrolledById(detail.id);
      setDetail(refreshed);
      onStudentUpdated(refreshed);
      queryClient.invalidateQueries({ queryKey: ["enrolled-list"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-stats"] });
    } catch {
      message.error("Failed to refresh student data");
    }
  };

  const tabItems = [
    {
      key: "overview",
      label: (
        <span className="flex items-center gap-1.5">
          <RiUserLine size={13} /> Overview
        </span>
      ),
      children: (
        <div className="flex flex-col gap-4 p-4">
          <AdmissionTimeline
            currentStage={detail?.stage}
            country={detail?.country ?? ""}
            activities={detail?.activities ?? []}
            onStageChange={handleStageChange}
          />
          <FeePaymentSection student={detail} onRefresh={handleRefresh} />
        </div>
      ),
    },
    {
      key: "visa",
      label: (
        <span className="flex items-center gap-1.5">
          <RiPassportLine size={13} /> Visa
        </span>
      ),
      children: (
        <div className="p-4">
          <VisaSection
            studentId={detail?.id ?? ""}
            visaDetail={detail?.visaDetail ?? null}
            casRef={detail?.casRef}
            visaStatus={detail?.visaStatus}
            onVisaUpdate={handleVisaUpdate}
          />
        </div>
      ),
    },
    {
      key: "documents",
      label: (
        <span className="flex items-center gap-1.5">
          <RiFolder3Line size={13} /> Documents
        </span>
      ),
      children: (
        <div className="p-4">
          <DocumentSection
            studentId={detail?.id ?? ""}
            documents={detail?.documents ?? []}
            onRefresh={handleRefresh}
          />
        </div>
      ),
    },
    {
      key: "predeparture",
      label: (
        <span className="flex items-center gap-1.5">
          <RiFlightTakeoffLine size={13} /> Pre-Departure
        </span>
      ),
      children: (
        <div className="p-4">
          <PreDepartureChecklist
            studentId={detail?.id ?? ""}
            items={detail?.preDeparture ?? []}
            onRefresh={handleRefresh}
          />
        </div>
      ),
    },
    ...(isAdmin
      ? [
          {
            key: "commission",
            label: (
              <span className="flex items-center gap-1.5">
                <RiHandCoinLine size={13} /> Commission
              </span>
            ),
            children: (
              <div className="p-4">
                <CommissionSection
                  studentId={detail?.id ?? ""}
                  commission={detail?.commission ?? null}
                  onRefresh={handleRefresh}
                />
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={900}
      title={null}
      destroyOnClose
      styles={{
        body: { padding: 0, background: "#F8FAFC" },
        header: { display: "none" },
      }}
    >
      {/* Close button */}
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/30 border-none rounded-lg p-1.5 cursor-pointer flex text-white transition-colors backdrop-blur-sm"
        >
          <RiCloseLine size={18} />
        </button>

        {/* Hero card — shows list-level data instantly while detail loads */}
        <StudentOverviewCard student={detail ?? student} />
      </div>

      {/* Loading overlay */}
      {detailLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Tabs
            items={tabItems}
            defaultActiveKey="overview"
            destroyInactiveTabPane={false}
            className="enrolled-detail-tabs"
            style={{ margin: 0 }}
          />
          <style>{`
            .enrolled-detail-tabs .ant-tabs-nav { padding: 0 16px; margin: 0; background: white; border-bottom: 1px solid #F1F5F9; }
            .enrolled-detail-tabs .ant-tabs-tab { padding: 12px 8px; font-size: 13px; font-weight: 600; }
            .enrolled-detail-tabs .ant-tabs-content-holder { background: #F8FAFC; }
          `}</style>
        </>
      )}
    </Drawer>
  );
};

export default StudentDetailDrawer;
