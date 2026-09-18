"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface ChartPoint {
  name: string;
  banca: number;
}

interface PerformanceChartProps {
  data: ChartPoint[];
  savedBank: number;
  take: number;
  stop: number;
}

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PerformanceChart({ data, savedBank, take, stop }: PerformanceChartProps) {
  const takeLine = savedBank + take;
  const stopLine = savedBank - stop;

  return (
    <div className="rounded-xl2 bg-base-850 border border-base-700 shadow-card p-4">
      <div className="flex items-center gap-2 text-base-300 mb-3 px-1">
        <TrendingUp size={18} />
        <span className="text-sm font-medium">Evolução da banca</span>
      </div>
      <div className="h-56 -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#2a2b30" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#7a7d87", fontSize: 11 }}
              axisLine={{ stroke: "#2a2b30" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#7a7d87", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={54}
              tickFormatter={(v) => `${Math.round(v)}`}
            />
            <Tooltip
              contentStyle={{
                background: "#17181b",
                border: "1px solid #2a2b30",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#cdcfd4" }}
              formatter={(value: number) => [formatBRL(value), "Banca"]}
            />
            <ReferenceLine
              y={takeLine}
              stroke="#22c55e"
              strokeDasharray="4 4"
              label={{ value: "Take", position: "insideTopLeft", fill: "#22c55e", fontSize: 11 }}
            />
            <ReferenceLine
              y={stopLine}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{ value: "Stop", position: "insideBottomLeft", fill: "#ef4444", fontSize: 11 }}
            />
            <Line
              type="monotone"
              dataKey="banca"
              stroke="#eab308"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#eab308", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
              isAnimationActive
              animationDuration={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
