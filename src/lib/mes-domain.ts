export type InspectionResult = "OK" | "FAIL";

export interface ControlMessage {
  clientId: string;
  plantCode: string;
  facilityId: string;
  timestamp: string;
  flag: "ON";
}

export interface MonitoringCounters {
  successAmount: number;
  failAmount: number;
  successRate: string;
  lastResult?: InspectionResult;
}

export interface InspectionLike {
  result?: string;
}

export interface ProcessScheduleSnapshot {
  schIdx: number;
  schDate: string;
  loadTime: number;
  schFacilityId: string;
}

export interface ProcessRecord {
  schIdx: number;
  prcCd: string;
  prcDate: string;
  prcLoadTime: number;
  prcFacilityId: string;
  prcResult: boolean;
  regDt: string;
}

export function buildControlMessage({
  clientId,
  plantCode,
  facilityId,
  now,
}: {
  clientId: string;
  plantCode: string;
  facilityId: string;
  now: string;
}): ControlMessage {
  return {
    clientId,
    plantCode,
    facilityId,
    timestamp: now,
    flag: "ON",
  };
}

export function normalizeInspectionResult(
  result: string | undefined,
): InspectionResult | null {
  const normalized = String(result || "").toUpperCase();
  return normalized === "OK" || normalized === "FAIL" ? normalized : null;
}

export function applyInspectionResult<T extends MonitoringCounters>(
  current: T,
  inspection: InspectionLike,
): T & MonitoringCounters {
  const result = normalizeInspectionResult(inspection.result);
  const successAmount = current.successAmount + (result === "OK" ? 1 : 0);
  const failAmount = current.failAmount + (result === "FAIL" ? 1 : 0);
  const total = successAmount + failAmount;
  const successRate =
    total === 0 ? "0.0 %" : `${((successAmount * 100) / total).toFixed(1)} %`;

  return {
    ...current,
    successAmount,
    failAmount,
    successRate,
    ...(result ? { lastResult: result } : {}),
  };
}

export function buildProcessRecord({
  schedule,
  inspection,
  now,
  id,
}: {
  schedule: ProcessScheduleSnapshot;
  inspection: InspectionLike;
  now: string;
  id: string;
}): ProcessRecord {
  return {
    schIdx: schedule.schIdx,
    prcCd: id,
    prcDate: schedule.schDate,
    prcLoadTime: schedule.loadTime,
    prcFacilityId: schedule.schFacilityId,
    prcResult: normalizeInspectionResult(inspection.result) === "OK",
    regDt: now,
  };
}

export function formatDateTime(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(
      "-",
    ) +
    " " +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(
      ":",
    )
  );
}

export function nextInspectionResult(): InspectionResult {
  return Math.random() > 0.35 ? "OK" : "FAIL";
}
