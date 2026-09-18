"use client";

import { DayStatus } from "@/lib/types";
import { AlertTriangle, PartyPopper } from "lucide-react";

interface DailyResultPanelProps {
  profit: number;
  loss: number;
  net: number;
  percent: number;
  dayStatus: DayStatus;
  onFinishDay: () => void;
  canFinish: boolean;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DailyResultPanel({
  profit,
  loss,
  net,
  percent,
  dayStatus,
  onFinishDay,
  canFinish,
}: DailyResultPanelProps) {
  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-5 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-[11px] text-base-400 mb-0.5">Lucro</div>
          <div className="text-base font-semibold text-profit tabular-nums">{formatBRL(profit)}</div>
        </div>
        <div>
          <div className="text-[11px] text-base-400 mb-0.5">Prejuízo</div>
          <div className="text-base font-semibold text-loss tabular-nums">{formatBRL(loss)}</div>
        </div>
        <div>
          <div className="text-[11px] text-base-400 mb-0.5">% da banca</div>
          <div
            className={`text-base font-semibold tabular-nums ${
              percent >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {percent >= 0 ? "+" : ""}
            {percent.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-base-900 border border-base-700 px-4 py-3">
        <span className="text-sm text-base-300">Resultado líquido</span>
        <span
          className={`text-lg font-bold tabular-nums ${net >= 0 ? "text-profit" : "text-loss"}`}
        >
          {net >= 0 ? "+" : ""}
          {formatBRL(net)}
        </span>
      </div>

      {dayStatus.locked && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium animate-slide-up ${
            dayStatus.reason === "take"
              ? "bg-profit-bg text-profit border border-profit/30"
              : "bg-loss-bg text-loss border border-loss/30"
          }`}
        >
          {dayStatus.reason === "take" ? <PartyPopper size={18} /> : <AlertTriangle size={18} />}
          {dayStatus.reason === "take" ? "Meta do dia atingida" : "Stop do dia atingido"}
        </div>
      )}

      <button
        onClick={onFinishDay}
        disabled={!canFinish}
        className="w-full rounded-lg bg-base-700 hover:bg-base-600 text-base-200 font-medium text-sm py-3 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.99] transition-all"
      >
        Encerrar dia e salvar no histórico
      </button>
    </div>
  );
}
