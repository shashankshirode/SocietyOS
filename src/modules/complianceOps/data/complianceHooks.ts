import { useState } from 'react';
import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { complianceOpsRepository } from './complianceOps.repository';
import type { ComplianceQuery } from './complianceOps.contracts';

                                                              

export function useComplianceHome() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceHome();
    return { ok: true, data: res };
  }, []);
}

export function useComplianceCalendar(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceCalendar(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useComplianceTasks(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceTasks(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useComplianceTaskDetail(taskId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceTaskDetail(taskId);
    return { ok: true, data: res };
  }, [taskId]);
}

export function useStartComplianceTask() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (taskId: string) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.startComplianceTask(taskId);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCompleteComplianceTask() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ taskId, input }: { taskId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.completeComplianceTask(taskId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useVerifyComplianceTask() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ taskId, input }: { taskId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.verifyComplianceTask(taskId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useReopenComplianceTask() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ taskId, input }: { taskId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.reopenComplianceTask(taskId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCreateComplianceTask() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.createComplianceTask(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

                                                              

export function useWasteDashboard() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getWasteDashboard();
    return { ok: true, data: res };
  }, []);
}

export function useWastePickupSchedule(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getWastePickupSchedule(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useMarkWastePickupCompleted() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ scheduleId, input }: { scheduleId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.markWastePickupCompleted(scheduleId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useSubmitWasteSegregationChecklist() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitWasteSegregationChecklist(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useReportMissedGarbagePickup() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.reportMissedGarbagePickup(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCreateWasteViolation() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.createWasteViolationPlaceholder(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useWasteSegregationReport(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getWasteSegregationReport(params);
    return { ok: true, data: res };
  }, [params]);
}

                                                              

export function useHousekeepingDashboard() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getHousekeepingDashboard();
    return { ok: true, data: res };
  }, []);
}

export function useHousekeepingSchedule(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getHousekeepingSchedule(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useHousekeepingRoundDetail(roundId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getHousekeepingRoundDetail(roundId);
    return { ok: true, data: res };
  }, [roundId]);
}

export function useStartHousekeepingRound() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (roundId: string) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.startHousekeepingRound(roundId);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCompleteHousekeepingRound() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ roundId, input }: { roundId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.completeHousekeepingRound(roundId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useSubmitFloorCleaningChecklist() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitFloorCleaningChecklist(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useSubmitCommonAreaInspection() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitCommonAreaInspection(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useSubmitSupervisorVerification() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ roundId, input }: { roundId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitSupervisorVerification({ roundId, ...input });
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useReportHousekeepingIssue() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.reportHousekeepingIssue(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

                                                              

export function useLiftSafetyDashboard() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftSafetyDashboard();
    return { ok: true, data: res };
  }, []);
}

export function useLiftRegister(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftRegister(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useLiftDetail(liftId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftDetail(liftId);
    return { ok: true, data: res };
  }, [liftId]);
}

export function useReportLiftBreakdown() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ liftId, input }: { liftId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.reportLiftBreakdown(liftId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useLiftMaintenanceVisitLog(liftId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftMaintenanceVisits(liftId);
    return { ok: true, data: res };
  }, [liftId]);
}

export function useAddLiftMaintenanceVisit() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ liftId, input }: { liftId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.addLiftMaintenanceVisit(liftId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useLiftCertificateTracker(liftId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftCertificates(liftId);
    return { ok: true, data: res };
  }, [liftId]);
}

export function useLiftCertificates(liftId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftCertificates(liftId);
    return { ok: true, data: res };
  }, [liftId]);
}

export function useStartLiftCertificateRenewal() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ liftId, input }: { liftId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.startLiftCertificateRenewal(liftId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useLiftDowntimeReport(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftDowntimeReport(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useLiftSafetyDocuments(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getLiftSafetyDocuments(params);
    return { ok: true, data: res };
  }, [params]);
}

                                                              

export function useFireSafetyDashboard() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireSafetyDashboard();
    return { ok: true, data: res };
  }, []);
}

export function useFireEquipmentRegister(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireEquipmentRegister(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useFireEquipmentDetail(equipmentId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireEquipmentDetail(equipmentId);
    return { ok: true, data: res };
  }, [equipmentId]);
}

export function useSubmitFireEquipmentInspection() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ equipmentId, input }: { equipmentId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitFireEquipmentInspection(equipmentId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useMarkFireEquipmentFaulty() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ equipmentId, input }: { equipmentId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.markFireEquipmentFaulty(equipmentId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useMarkFireEquipmentReplaced() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ equipmentId, input }: { equipmentId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.markFireEquipmentReplaced(equipmentId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useFireExtinguisherExpiry(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireExtinguisherExpiry(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useFireNocTracker() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireNocTracker();
    return { ok: true, data: res };
  }, []);
}

export function useStartFireNocRenewal() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.startFireNocRenewal(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useHydrantPumpChecklist() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitHydrantPumpChecklist(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useSubmitHydrantPumpChecklist() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.submitHydrantPumpChecklist(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useFireDrillRecords(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireDrillRecords(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useFireDrillDetail(drillId: string) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getFireDrillDetail(drillId);
    return { ok: true, data: res };
  }, [drillId]);
}

export function useCreateFireDrill() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async (input: JsonObject) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.createFireDrill(input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useCompleteFireDrill() {
  const [isPending, setIsPending] = useState(false);
  const mutateAsync = async ({ drillId, input }: { drillId: string; input: JsonObject }) => {
    setIsPending(true);
    try {
      return await complianceOpsRepository.completeFireDrill(drillId, input);
    } finally {
      setIsPending(false);
    }
  };
  return { mutateAsync, isPending };
}

export function useEvacuationPlan() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getEvacuationPlan();
    return { ok: true, data: res };
  }, []);
}

export function useSafetyInspectionReport(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getSafetyInspectionReport(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useComplianceReports(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceReports(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useComplianceAuditLogs(params?: ComplianceQuery) {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceAuditLogs(params);
    return { ok: true, data: res };
  }, [params]);
}

export function useComplianceSettings() {
  return useRepositoryResult(async () => {
    const res = await complianceOpsRepository.getComplianceSettings();
    return { ok: true, data: res };
  }, []);
}
