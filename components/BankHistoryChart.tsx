"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { LineChart, TrendingUp, TrendingDown } from "lucide-react";

interface Point {
  name: string;
  banca: number;
}

interface BankHistoryChartProps {
  data: Point[];
  savedBank: number;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function BankHistoryChart({ data, savedBank }: BankHistoryChartProps) {
  const hasData = data.length > 1;
  const first = data[0]?.banca ?? savedBank;
  const last = data[data.length - 1]?.banca ?? savedBank;
  const totalNet = Math.round((last - first) * 100) / 100;
  const up = totalNet >= 0;

  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2 text-base-300">
          <LineChart size={18} className="text-accent" />
          <span className="text-sm font-medium">Evolução da banca</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold tabular-nums text-base-100">
            {formatBRL(last)}
          </div>
          <div
            className={`flex items-center justify-end gap-1 text-xs font-semibold tabular-nums ${
              up ? "text-profit" : "text-loss"
            }`}
          >
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {up ? "+" : ""}
            {formatBRL(totalNet)}
          </div>
        </div>
      </div>

      {hasData ? (
        <div className="h-56 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="bankGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#272c39" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "#78808f", fontSize: 11 }}
                axisLine={{ stroke: "#272c39" }}
                tickLine={false}
                minTickGap={16}
              />
              <YAxis
                tick={{ fill: "#78808f", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={54}
                tickFormatter={(v) => `R$${v}`}
              />
              <Tooltip
                contentStyle={{
                  background: "#141720",
                  border: "1px solid #272c39",
                  borderRadius: 12,
                  color: "#ccd1da",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#78808f" }}
                formatter={(value: number) => [formatBRL(value), "Banca"]}
              />
              <Area
                type="monotone"
                dataKey="banca"
                stroke="#22d3ee"
                strokeWidth={2.5}
                fill="url(#bankGradient)"
                dot={{ r: 3, fill: "#22d3ee", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#22d3ee", stroke: "#08090c", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-56 flex flex-col items-center justify-center text-center gap-2 text-base-500">
          <LineChart size={28} className="opacity-40" />
          <p className="text-sm">Nenhum dia encerrado ainda.</p>
          <p className="text-xs text-base-600 max-w-[220px]">
            Encerre seu primeiro dia na aba Operar para ver a evolução da banca aqui.
          </p>
        </div>
      )}
    </div>
  );
}
