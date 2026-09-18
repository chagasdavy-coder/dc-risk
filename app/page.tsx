"use client";

import { useState } from "react";
import { useRiskManagement } from "@/hooks/useRiskManagement";
import BankCard from "@/components/BankCard";
import RiskSelector from "@/components/RiskSelector";
import OperationTable from "@/components/OperationTable";
import PerformanceChart from "@/components/PerformanceChart";
import DailyResultPanel from "@/components/DailyResultPanel";
import StatisticsCards from "@/components/StatisticsCards";
import HistoryTable from "@/components/HistoryTable";
import Dashboard from "@/components/Dashboard";
import { Settings2 } from "lucide-react";

type Tab = "inicio" | "operar" | "estatisticas" | "historico";

export default function Home() {
  const rm = useRiskManagement();
  const [tab, setTab] = useState<Tab>("inicio");
  const [showSettings, setShowSettings] = useState(false);

  const playedCount = rm.operations.filter((op) => op.result !== null).length;

  return (
    <main className="max-w-md mx-auto px-4 pt-6 pb-10 space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <div
            role="img"
            aria-label="DC Trader · Operações & Gestão"
            style={{
              width: 230,
              height: 36,
              backgroundImage: "url(/dc-trader-logo.png)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "461px auto",
              backgroundPosition: "-116px -126px",
            }}
          />
          <p className="text-xs text-base-500 mt-1">Gestão de risco · payout {(rm.payout * 100).toFixed(0)}%</p>
        </div>
        <button
          onClick={() => setShowSettings((s) => !s)}
          className="p-2 rounded-lg bg-base-850 border border-base-700 text-base-400 active:scale-95 transition-transform"
          aria-label="Configurações"
        >
          <Settings2 size={18} />
        </button>
      </header>

      {showSettings && (
        <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-4 animate-slide-up">
          <label className="text-xs text-base-400 block mb-2">Payout (%)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={Math.round(rm.payout * 100)}
            onChange={(e) => rm.setPayout((parseFloat(e.target.value) || 0) / 100)}
            className="w-full bg-base-900 border border-base-700 rounded-lg py-2.5 px-3 text-sm text-base-200 outline-none focus:border-accent transition-colors"
          />
        </div>
      )}

      <nav className="grid grid-cols-4 gap-1.5 bg-base-900 border border-base-700 rounded-lg p-1">
        {(
          [
            ["inicio", "Início"],
            ["operar", "Operar"],
            ["estatisticas", "Estatísticas"],
            ["historico", "Histórico"],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`text-xs font-medium py-2 rounded-md transition-colors ${
              tab === key
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-base-400 border border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {tab === "inicio" && (
        <Dashboard
          bankHistory={rm.bankHistory}
          calendarData={rm.calendarData}
          savedBank={rm.savedBank}
        />
      )}

      {tab === "operar" && (
        <div className="space-y-5">
          <BankCard
            bank={rm.bank}
            savedBank={rm.savedBank}
            onBankChange={rm.setBank}
            onSave={rm.saveBank}
            management={rm.management}
            take={rm.take}
            stop={rm.stop}
          />

          <RiskSelector risk={rm.risk} onChange={rm.setRisk} disabled={playedCount > 0} />

          <OperationTable
            operations={rm.operations}
            onResult={rm.registerResult}
            onPayoutChange={rm.setOperationPayout}
            onPairChange={rm.setOperationPair}
            locked={rm.dayStatus.locked}
          />

          <PerformanceChart
            data={rm.chartData}
            savedBank={rm.savedBank}
            take={rm.take}
            stop={rm.stop}
          />

          <DailyResultPanel
            profit={rm.dailyResult.profit}
            loss={rm.dailyResult.loss}
            net={rm.dailyResult.net}
            percent={rm.dailyResult.percent}
            dayStatus={rm.dayStatus}
            onFinishDay={rm.finishDay}
            canFinish={playedCount > 0}
          />
        </div>
      )}

      {tab === "estatisticas" && <StatisticsCards statistics={rm.statistics} />}

      {tab === "historico" && <HistoryTable history={rm.history} />}
    </main>
  );
}
