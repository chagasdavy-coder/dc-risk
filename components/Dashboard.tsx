"use client";

import BankHistoryChart from "./BankHistoryChart";
import ResultCalendar from "./ResultCalendar";

interface DashboardProps {
  bankHistory: { name: string; banca: number }[];
  calendarData: Record<string, number>;
  savedBank: number;
}

export default function Dashboard({ bankHistory, calendarData, savedBank }: DashboardProps) {
  return (
    <div className="space-y-5">
      <BankHistoryChart data={bankHistory} savedBank={savedBank} />
      <ResultCalendar data={calendarData} />
    </div>
  );
}
