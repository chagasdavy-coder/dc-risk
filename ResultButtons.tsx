"use client";

import { Check, X } from "lucide-react";
import { OperationResult } from "@/lib/types";

interface ResultButtonsProps {
  disabled: boolean;
  result: OperationResult;
  onResult: (result: OperationResult) => void;
}

export default function ResultButtons({ disabled, result, onResult }: ResultButtonsProps) {
  if (result !== null) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold animate-pop ${
          result === "win" ? "bg-profit-bg text-profit" : "bg-loss-bg text-loss"
        }`}
      >
        {result === "win" ? <Check size={14} /> : <X size={14} />}
        {result === "win" ? "Vitória" : "Derrota"}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={disabled}
        onClick={() => onResult("win")}
        className="flex items-center gap-1.5 rounded-lg bg-profit/15 hover:bg-profit/25 text-profit border border-profit/30 px-3 py-2 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
      >
        <Check size={16} /> Win
      </button>
      <button
        disabled={disabled}
        onClick={() => onResult("loss")}
        className="flex items-center gap-1.5 rounded-lg bg-loss/15 hover:bg-loss/25 text-loss border border-loss/30 px-3 py-2 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
      >
        <X size={16} /> Loss
      </button>
    </div>
  );
}
