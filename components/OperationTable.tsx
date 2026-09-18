"use client";

import { Operation, OperationResult } from "@/lib/types";
import ResultButtons from "./ResultButtons";
import { Percent } from "lucide-react";

interface OperationTableProps {
  operations: Operation[];
  onResult: (id: 1 | 2 | 3 | 4, result: OperationResult) => void;
  onPayoutChange: (id: 1 | 2 | 3 | 4, payout: number) => void;
  onPairChange: (id: 1 | 2 | 3 | 4, pair: string) => void;
  locked: boolean;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const NEXT_LABEL: Record<number, string> = {
  1: "Entrada 3",
  2: "Entrada 4",
  3: "Final",
  4: "Final",
};

export default function OperationTable({
  operations,
  onResult,
  onPayoutChange,
  onPairChange,
  locked,
}: OperationTableProps) {
  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card overflow-hidden">
      <div className="divide-y divide-base-700">
        {operations.map((op) => {
          const isPlayable = op.active && op.result === null && !locked;
          const isClosed = !op.active && op.result === null;

          return (
            <div
              key={op.id}
              className={`px-4 py-4 transition-opacity ${
                !op.active && op.result === null ? "opacity-40" : "animate-slide-up"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-base-200">{op.label}</div>
                  <div className="text-xs text-base-400 mt-0.5">
                    {isClosed ? (
                      "Encerrada"
                    ) : (
                      <>
                        Valor:{" "}
                        <span className="text-base-300 font-medium tabular-nums">
                          {formatBRL(op.value)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-[11px] text-base-500 mt-0.5">
                    Próxima: {NEXT_LABEL[op.id]}
                  </div>
                </div>

                <div className="shrink-0">
                  {isClosed ? (
                    <span className="text-xs text-base-500 italic">—</span>
                  ) : (
                    <ResultButtons
                      disabled={!isPlayable}
                      result={op.result}
                      onResult={(r) => onResult(op.id, r)}
                    />
                  )}
                </div>
              </div>

              {isPlayable && (
                <div className="mt-3 flex items-end gap-2">
                  <label className="flex-1">
                    <span className="block text-[10px] uppercase tracking-wide text-base-500 mb-1">
                      Paridade
                    </span>
                    <input
                      type="text"
                      value={op.pair}
                      placeholder="EUR/USD"
                      onChange={(e) => onPairChange(op.id, e.target.value)}
                      className="w-full bg-base-900 border border-base-700 rounded-lg py-2 px-3 text-sm text-base-200 outline-none focus:border-accent transition-colors placeholder:text-base-600"
                    />
                  </label>
                  <label className="w-28">
                    <span className="block text-[10px] uppercase tracking-wide text-base-500 mb-1">
                      Payout
                    </span>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={1}
                        max={100}
                        value={Math.round(op.payout * 100)}
                        onChange={(e) =>
                          onPayoutChange(op.id, (parseFloat(e.target.value) || 0) / 100)
                        }
                        className="w-full bg-base-900 border border-base-700 rounded-lg py-2 pl-3 pr-8 text-sm font-semibold tabular-nums text-accent outline-none focus:border-accent transition-colors"
                      />
                      <Percent
                        size={13}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-500"
                      />
                    </div>
                  </label>
                </div>
              )}

              {op.result !== null && (op.pair || op.payout) && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-base-500">
                  {op.pair && <span className="font-medium text-base-400">{op.pair}</span>}
                  <span className="tabular-nums">payout {Math.round(op.payout * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
