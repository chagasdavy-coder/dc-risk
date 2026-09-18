"use client";

import { HistoryEntry, RISK_LABELS } from "@/lib/types";
import { History } from "lucide-react";

interface HistoryTableProps {
  history: HistoryEntry[];
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default function HistoryTable({ history }: HistoryTableProps) {
  const sorted = [...history].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-4">
      <div className="flex items-center gap-2 text-base-300 mb-3 px-1">
        <History size={18} />
        <span className="text-sm font-medium">Histórico</span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-base-500 px-1 py-4 text-center">
          Nenhum dia registrado ainda. Encerre um dia de operações para vê-lo aqui.
        </p>
      ) : (
        <div className="space-y-2">
          {sorted.map((entry) => (
            <div
              key={entry.id}
              className="rounded-lg bg-base-900 border border-base-700 px-3 py-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-base-200">{formatDate(entry.date)}</div>
                <div className="text-[11px] text-base-500 mt-0.5">
                  {RISK_LABELS[entry.risk]} · Payout {(entry.payout * 100).toFixed(0)}% ·{" "}
                  {entry.entries.length} entrada{entry.entries.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div
                className={`text-sm font-semibold tabular-nums shrink-0 ${
                  entry.netResult >= 0 ? "text-profit" : "text-loss"
                }`}
              >
                {entry.netResult >= 0 ? "+" : ""}
                {formatBRL(entry.netResult)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
