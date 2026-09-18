export type RiskLevel = "conservador" | "medio" | "alto";

export type OperationResult = "win" | "loss" | null;

export interface Operation {
  id: 1 | 2 | 3 | 4;
  label: string;
  value: number; // stake value for this operation
  result: OperationResult;
  active: boolean; // whether this operation is currently playable
  profit: number; // realized profit/loss contributed by this operation
}

export interface DayStatus {
  locked: boolean;
  reason: "take" | "stop" | null;
}

export interface HistoryEntry {
  id: string;
  date: string; // ISO date (day only)
  timestamp: number;
  initialBank: number;
  risk: RiskLevel;
  payout: number;
  entries: { label: string; value: number; result: OperationResult }[];
  profit: number;
  loss: number;
  netResult: number;
}

export interface Statistics {
  daysOperated: number;
  winRate: number; // 0-100
  totalProfit: number;
  totalLoss: number;
  roi: number; // 0-100, relative to sum of initial banks
  bestWinStreak: number;
  worstLossStreak: number;
}

export const RISK_DIVISORS: Record<RiskLevel, number> = {
  conservador: 20,
  medio: 10,
  alto: 5,
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  conservador: "Conservador",
  medio: "Médio",
  alto: "Alto",
};
