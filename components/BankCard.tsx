"use client";

import { Wallet, Save } from "lucide-react";

interface BankCardProps {
  bank: number;
  savedBank: number;
  onBankChange: (value: number) => void;
  onSave: () => void;
  management: number;
  take: number;
  stop: number;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function BankCard({
  bank,
  savedBank,
  onBankChange,
  onSave,
  management,
  take,
  stop,
}: BankCardProps) {
  const dirty = bank !== savedBank;

  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-5 space-y-4">
      <div className="flex items-center gap-2 text-base-300">
        <Wallet size={18} />
        <span className="text-sm font-medium">Valor da banca</span>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-400 text-sm">
            R$
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={bank}
            onChange={(e) => onBankChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-base-900 border border-base-700 rounded-lg py-3 pl-9 pr-3 text-lg font-semibold text-base-200 outline-none focus:border-accent transition-colors"
          />
        </div>
        <button
          onClick={onSave}
          disabled={!dirty}
          className="flex items-center gap-2 px-4 rounded-lg bg-accent text-base-950 font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          <Save size={16} />
          Salvar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <Stat label="Banca atual" value={formatBRL(savedBank)} />
        <Stat label="Valor da gestão" value={formatBRL(management)} />
        <Stat label="Take do dia" value={formatBRL(take)} tone="profit" />
        <Stat label="Stop do dia" value={formatBRL(-stop)} tone="loss" />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "profit" | "loss";
}) {
  const color =
    tone === "profit" ? "text-profit" : tone === "loss" ? "text-loss" : "text-base-200";
  return (
    <div className="rounded-lg bg-base-900 border border-base-700 px-3 py-2.5">
      <div className="text-[11px] text-base-400 mb-0.5">{label}</div>
      <div className={`text-base font-semibold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}
