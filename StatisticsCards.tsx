"use client";

import { Statistics } from "@/lib/types";
import { CalendarDays, Target, TrendingUp, TrendingDown, Percent, Flame, Snowflake } from "lucide-react";

interface StatisticsCardsProps {
  statistics: Statistics;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function StatisticsCards({ statistics }: StatisticsCardsProps) {
  const items = [
    { label: "Dias operados", value: statistics.daysOperated.toString(), icon: CalendarDays },
    { label: "Taxa de acerto", value: `${statistics.winRate.toFixed(1)}%`, icon: Target },
    { label: "Lucro total", value: formatBRL(statistics.totalProfit), icon: TrendingUp, tone: "profit" as const },
    { label: "Prejuízo total", value: formatBRL(statistics.totalLoss), icon: TrendingDown, tone: "loss" as const },
    { label: "ROI", value: `${statistics.roi.toFixed(1)}%`, icon: Percent, tone: statistics.roi >= 0 ? ("profit" as const) : ("loss" as const) },
    { label: "Sequência de vitórias", value: statistics.bestWinStreak.toString(), icon: Flame, tone: "profit" as const },
    { label: "Sequência de derrotas", value: statistics.worstLossStreak.toString(), icon: Snowflake, tone: "loss" as const },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-4"
        >
          <div className="flex items-center gap-1.5 text-base-400 mb-2">
            <Icon size={14} />
            <span className="text-[11px]">{label}</span>
          </div>
          <div
            className={`text-lg font-semibold tabular-nums ${
              tone === "profit" ? "text-profit" : tone === "loss" ? "text-loss" : "text-base-200"
            }`}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
