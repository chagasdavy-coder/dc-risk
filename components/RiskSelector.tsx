"use client";

import type { ReactNode } from "react";
import { RiskLevel, RISK_LABELS } from "@/lib/types";
import { Shield, Gauge, Flame } from "lucide-react";

interface RiskSelectorProps {
  risk: RiskLevel;
  onChange: (risk: RiskLevel) => void;
  disabled?: boolean;
}

const ICONS: Record<RiskLevel, ReactNode> = {
  conservador: <Shield size={16} />,
  medio: <Gauge size={16} />,
  alto: <Flame size={16} />,
};

export default function RiskSelector({ risk, onChange, disabled }: RiskSelectorProps) {
  const levels: RiskLevel[] = ["conservador", "medio", "alto"];

  return (
    <div className="grid grid-cols-3 gap-2">
      {levels.map((level) => {
        const active = level === risk;
        return (
          <button
            key={level}
            disabled={disabled}
            onClick={() => onChange(level)}
            className={`flex flex-col items-center justify-center gap-1.5 rounded-lg py-3 border text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
              active
                ? "bg-accent/10 border-accent text-accent"
                : "bg-base-900 border-base-700 text-base-400 active:scale-95"
            }`}
          >
            {ICONS[level]}
            {RISK_LABELS[level]}
          </button>
        );
      })}
    </div>
  );
}
