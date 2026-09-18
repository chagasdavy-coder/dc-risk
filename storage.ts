import { HistoryEntry } from "./types";

const HISTORY_KEY = "gro_history_v1";
const SETTINGS_KEY = "gro_settings_v1";

export interface Settings {
  bank: number;
  payout: number;
  risk: string;
}

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // storage unavailable (e.g. private mode) - fail silently
  }
}

export function appendHistoryEntry(entry: HistoryEntry) {
  const history = loadHistory();
  history.push(entry);
  saveHistory(history);
  return history;
}

export function loadSettings(): Settings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as Settings) : null;
  } catch {
    return null;
  }
}

export function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
