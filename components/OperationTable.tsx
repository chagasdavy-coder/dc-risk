"use client";

import { Operation, OperationResult } from "@/lib/types";
import ResultButtons from "./ResultButtons";

interface OperationTableProps {
  operations: Operation[];
  onResult: (id: 1 | 2 | 3 | 4, result: OperationResult) => void;
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

export default function OperationTable({ operations, onResult, locked }: OperationTableProps) {
  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card overflow-hidden">
      <div className="divide-y divide-base-700">
        {operations.map((op) => {
          const isPlayable = op.active && op.result === null && !locked;
          const isClosed = !op.active && op.result === null;

          return (
            <div
              key={op.id}
              className={`flex items-center justify-between gap-3 px-4 py-4 transition-opacity ${
                !op.active && op.result === null ? "opacity-40" : "animate-slide-up"
              }`}
            >
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
          );
        })}
      </div>
    </div>
  );
}
