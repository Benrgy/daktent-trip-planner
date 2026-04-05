import { useEffect, useCallback } from "react";
import { TripConfig } from "@/components/TripWizard";

const STORAGE_KEY = "daktent-last-trip";

export function saveTripToStorage(config: TripConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {}
}

export function loadTripFromStorage(): TripConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function encodeTripUrl(config: TripConfig): string {
  try {
    const json = JSON.stringify(config);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return `${window.location.origin}${window.location.pathname}?trip=${encoded}`;
  } catch {
    return window.location.href;
  }
}

export function decodeTripFromUrl(): TripConfig | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const tripParam = params.get("trip");
    if (!tripParam) return null;
    const json = decodeURIComponent(escape(atob(tripParam)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useShareTrip() {
  const shareTrip = useCallback(async (config: TripConfig) => {
    const url = encodeTripUrl(config);
    try {
      if (navigator.share) {
        await navigator.share({ title: "DaktentTripPlanner - Mijn trip", url });
      } else {
        await navigator.clipboard.writeText(url);
        return "copied";
      }
      return "shared";
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        return "copied";
      } catch {
        return "error";
      }
    }
  }, []);

  return { shareTrip };
}
