"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DayStatus,
  HistoryEntry,
  Operation,
  OperationResult,
  RISK_DIVISORS,
  RiskLevel,
  Statistics,
} from "@/lib/types";
import { appendHistoryEntry, loadHistory, loadSettings, saveSettings } from "@/lib/storage";

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function emptyOperations(payout = 0.9): Operation[] {
  return [
    { id: 1, label: "Entrada 1", value: 0, result: null, active: true, profit: 0, payout, pair: "" },
    { id: 2, label: "Entrada 2", value: 0, result: null, active: true, profit: 0, payout, pair: "" },
    { id: 3, label: "Entrada 3", value: 0, result: null, active: false, profit: 0, payout, pair: "" },
    { id: 4, label: "Entrada 4", value: 0, result: null, active: false, profit: 0, payout, pair: "" },
  ];
}

export function useRiskManagement() {
  const [bank, setBankRaw] = useState<number>(100);
  const [savedBank, setSavedBank] = useState<number>(100);
  const [risk, setRisk] = useState<RiskLevel>("medio");
  const [payout, setPayout] = useState<number>(0.9);
  const [operations, setOperations] = useState<Operation[]>(emptyOperations());
  const [dayStatus, setDayStatus] = useState<DayStatus>({ locked: false, reason: null });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load persisted state on mount
  useEffect(() => {
    const settings = loadSettings();
    if (settings) {
      setBankRaw(settings.bank);
      setSavedBank(settings.bank);
      setPayout(settings.payout);
      setRisk(settings.risk as RiskLevel);
    }
    setHistory(loadHistory());
  }, []);

  // Management (gestão) derives from the last *saved* bank value
  const divisor = RISK_DIVISORS[risk];
  const management = useMemo(() => round2(savedBank / divisor), [savedBank, divisor]);
  const baseEntryValue = useMemo(() => round2(management / 2), [management]);

  const take = useMemo(() => round2(management * 2), [management]);
  const stop = useMemo(() => round2(management * 1), [management]);

  // Re-seed entrada 1 / entrada 2 values whenever management changes and nothing has been played yet
  useEffect(() => {
    setOperations((prev) => {
      const untouched = prev.every((op) => op.result === null);
      if (!untouched) return prev;
      return prev.map((op) =>
        op.id === 1 || op.id === 2 ? { ...op, value: baseEntryValue } : op
      );
    });
  }, [baseEntryValue]);

  // Keep untouched operations aligned with the global default payout
  useEffect(() => {
    setOperations((prev) => {
      const untouched = prev.every((op) => op.result === null);
      if (!untouched) return prev;
      if (prev.every((op) => op.payout === payout)) return prev;
      return prev.map((op) => ({ ...op, payout }));
    });
  }, [payout]);

  const setBank = useCallback((value: number) => {
    setBankRaw(Math.max(0, value));
  }, []);

  const saveBank = useCallback(() => {
    const safe = Math.max(0, bank);
    setSavedBank(safe);
    saveSettings({ bank: safe, payout, risk });
  }, [bank, payout, risk]);

  const updateRisk = useCallback(
    (r: RiskLevel) => {
      setRisk(r);
      saveSettings({ bank: savedBank, payout, risk: r });
    },
    [savedBank, payout]
  );

  const updatePayout = useCallback(
    (p: number) => {
      const safe = Math.min(1, Math.max(0.01, p));
      setPayout(safe);
      saveSettings({ bank: savedBank, payout: safe, risk });
    },
    [savedBank, risk]
  );

  // Net result of the current round, computed from every operation played so far
  const dailyResult = useMemo(() => {
    const profit = operations.reduce((sum, op) => (op.profit > 0 ? sum + op.profit : sum), 0);
    const loss = operations.reduce((sum, op) => (op.profit < 0 ? sum + Math.abs(op.profit) : sum), 0);
    const net = round2(profit - loss);
    const percent = savedBank > 0 ? round2((net / savedBank) * 100) : 0;
    return { profit: round2(profit), loss: round2(loss), net, percent };
  }, [operations, savedBank]);

  const registerResult = useCallback(
    (id: 1 | 2 | 3 | 4, result: OperationResult) => {
      if (dayStatus.locked) return;

      setOperations((prev) => {
        const next = prev.map((op) => ({ ...op }));
        const current = next.find((o) => o.id === id);
        if (!current || !current.active || current.result !== null) return prev;

        current.result = result;

        if (id === 1 || id === 2) {
          const nextEntry = next.find((o) => o.id === (id === 1 ? 3 : 4))!;
          if (result === "win") {
            const lucro = round2(current.value * current.payout);
            current.profit = lucro;
            nextEntry.value = round2(current.value + lucro);
            nextEntry.active = true;
          } else {
            current.profit = -current.value;
            nextEntry.value = 0;
            nextEntry.active = false;
          }
        } else {
          // entrada 3 or 4: only exists because its parent won
          if (result === "win") {
            const lucro = round2(current.value * current.payout);
            current.profit = lucro;
          } else {
            current.profit = -current.value;
          }
        }

        return next;
      });
    },
    [dayStatus.locked]
  );

  const setOperationPayout = useCallback((id: 1 | 2 | 3 | 4, p: number) => {
    const safe = Math.min(1, Math.max(0.01, p));
    setOperations((prev) => prev.map((op) => (op.id === id ? { ...op, payout: safe } : op)));
  }, []);

  const setOperationPair = useCallback((id: 1 | 2 | 3 | 4, pair: string) => {
    setOperations((prev) => prev.map((op) => (op.id === id ? { ...op, pair } : op)));
  }, []);

  // Evaluate take/stop after every change to results
  useEffect(() => {
    if (dayStatus.locked) return;
    if (management <= 0) return;
    if (dailyResult.net >= take && take > 0) {
      setDayStatus({ locked: true, reason: "take" });
    } else if (dailyResult.net <= -stop && stop > 0) {
      setDayStatus({ locked: true, reason: "stop" });
    }
  }, [dailyResult.net, take, stop, management, dayStatus.locked]);

  const chartData = useMemo(() => {
    let running = savedBank;
    const points: { name: string; banca: number; played?: boolean }[] = [
      { name: "Banca inicial", banca: round2(running) },
    ];
    for (const op of operations) {
      if (op.result !== null) {
        running += op.profit;
      }
      points.push({
        name: op.label,
        banca: round2(running),
        played: op.result !== null,
      });
    }
    return points;
  }, [operations, savedBank]);

  // Evolution of the bank across saved days (for the dashboard chart)
  const bankHistory = useMemo(() => {
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const points: { name: string; banca: number }[] = [];
    if (sorted.length > 0) {
      points.push({ name: "Início", banca: round2(sorted[0].initialBank) });
    }
    for (const h of sorted) {
      const d = new Date(h.date + "T00:00:00");
      const name = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      points.push({ name, banca: round2(h.initialBank + h.netResult) });
    }
    return points;
  }, [history]);

  // Net result aggregated by ISO date (for the calendar)
  const calendarData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const h of history) {
      map[h.date] = round2((map[h.date] ?? 0) + h.netResult);
    }
    return map;
  }, [history]);

  const resetOperations = useCallback(() => {
    setOperations(
      emptyOperations(payout).map((op) =>
        op.id === 1 || op.id === 2 ? { ...op, value: baseEntryValue } : op
      )
    );
    setDayStatus({ locked: false, reason: null });
  }, [baseEntryValue, payout]);

  const finishDay = useCallback(() => {
    const played = operations.filter((op) => op.result !== null);
    if (played.length === 0) return;

    const entry: HistoryEntry = {
      id: `${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      timestamp: Date.now(),
      initialBank: savedBank,
      risk,
      payout,
      entries: played.map((op) => ({
        label: op.label,
        value: op.value,
        result: op.result,
        payout: op.payout,
        pair: op.pair,
      })),
      profit: dailyResult.profit,
      loss: dailyResult.loss,
      netResult: dailyResult.net,
    };

    const updated = appendHistoryEntry(entry);
    setHistory(updated);

    const newBank = round2(savedBank + dailyResult.net);
    setBankRaw(newBank);
    setSavedBank(newBank);
    saveSettings({ bank: newBank, payout, risk });
    resetOperations();
  }, [operations, savedBank, risk, payout, dailyResult, resetOperations]);

  const statistics: Statistics = useMemo(() => {
    if (history.length === 0) {
      return {
        daysOperated: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        roi: 0,
        bestWinStreak: 0,
        worstLossStreak: 0,
      };
    }

    const uniqueDays = new Set(history.map((h) => h.date));
    let wins = 0;
    let total = 0;
    let totalProfit = 0;
    let totalLoss = 0;
    let totalInitialBank = 0;
    let bestWinStreak = 0;
    let worstLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    for (const day of history) {
      totalProfit += day.profit;
      totalLoss += day.loss;
      totalInitialBank += day.initialBank;
      for (const e of day.entries) {
        if (e.result === null) continue;
        total += 1;
        if (e.result === "win") {
          wins += 1;
          currentWinStreak += 1;
          currentLossStreak = 0;
        } else {
          currentLossStreak += 1;
          currentWinStreak = 0;
        }
        bestWinStreak = Math.max(bestWinStreak, currentWinStreak);
        worstLossStreak = Math.max(worstLossStreak, currentLossStreak);
      }
    }

    return {
      daysOperated: uniqueDays.size,
      winRate: total > 0 ? round2((wins / total) * 100) : 0,
      totalProfit: round2(totalProfit),
      totalLoss: round2(totalLoss),
      roi: totalInitialBank > 0 ? round2(((totalProfit - totalLoss) / totalInitialBank) * 100) : 0,
      bestWinStreak,
      worstLossStreak,
    };
  }, [history]);

  return {
    bank,
    setBank,
    saveBank,
    savedBank,
    risk,
    setRisk: updateRisk,
    payout,
    setPayout: updatePayout,
    management,
    take,
    stop,
    operations,
    registerResult,
    setOperationPayout,
    setOperationPair,
    dailyResult,
    dayStatus,
    resetOperations,
    finishDay,
    chartData,
    bankHistory,
    calendarData,
    history,
    statistics,
  };
}
