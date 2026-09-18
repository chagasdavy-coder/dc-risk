"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface ResultCalendarProps {
  data: Record<string, number>;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCompact(value: number) {
  const sign = value >= 0 ? "+" : "-";
  return sign + Math.abs(Math.round(value)).toLocaleString("pt-BR");
}

export default function ResultCalendar({ data }: ResultCalendarProps) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });
  const { y, m } = cursor;

  const startWeekday = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  let monthTotal = 0;
  let daysWithData = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${pad(m + 1)}-${pad(d)}`;
    if (data[key] !== undefined) {
      monthTotal += data[key];
      daysWithData++;
    }
  }
  monthTotal = Math.round(monthTotal * 100) / 100;

  const monthLabel = new Date(y, m, 1).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const prev = () =>
    setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }));
  const next = () =>
    setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }));

  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-base-300">
          <CalendarDays size={18} className="text-accent" />
          <span className="text-sm font-medium">Calendário de resultados</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Mês anterior"
            className="p-1.5 rounded-lg text-base-400 hover:text-base-200 hover:bg-base-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            aria-label="Próximo mês"
            className="p-1.5 rounded-lg text-base-400 hover:text-base-200 hover:bg-base-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-base-200 capitalize">{monthLabel}</span>
        {daysWithData > 0 && (
          <span
            className={`text-sm font-bold tabular-nums ${
              monthTotal >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {monthTotal >= 0 ? "+" : ""}
            {formatBRL(monthTotal)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-base-500 py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const key = `${y}-${pad(m + 1)}-${pad(d)}`;
          const net = data[key];
          const has = net !== undefined;
          const pos = has && net > 0;
          const neg = has && net < 0;

          return (
            <div
              key={i}
              title={has ? `${d}: ${formatBRL(net)}` : undefined}
              className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-0.5 p-0.5 transition-colors ${
                pos
                  ? "bg-profit/15 border-profit/40"
                  : neg
                  ? "bg-loss/15 border-loss/40"
                  : "bg-base-900 border-base-800"
              }`}
            >
              <span
                className={`text-[11px] font-medium leading-none ${
                  pos ? "text-profit" : neg ? "text-loss" : "text-base-400"
                }`}
              >
                {d}
              </span>
              {has && (
                <span
                  className={`text-[9px] font-semibold tabular-nums leading-none ${
                    pos ? "text-profit" : "text-loss"
                  }`}
                >
                  {formatCompact(net)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-base-700">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-profit/40 border border-profit/50" />
          <span className="text-[11px] text-base-400">Dia positivo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-loss/40 border border-loss/50" />
          <span className="text-[11px] text-base-400">Dia negativo</span>
        </div>
      </div>
    </div>
  );
}
