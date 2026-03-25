"use client";

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const TOUR_STEP_KEY = 'serenity_tour_step';
export const TOUR_DONE_KEY = 'serenity_tour_done';

// Map each step number to the page it runs on
export const TOUR_PAGES: Record<number, string> = {
  1: '/journal',
  2: '/reflection',
  3: '/reflection',
  4: '/voice',
  5: '/community',
};

export function useTour() {
  const router = useRouter();

  const startTour = useCallback(() => {
    localStorage.removeItem(TOUR_DONE_KEY);
    localStorage.setItem(TOUR_STEP_KEY, '1');
    router.push('/journal');
  }, [router]);

  const markDone = useCallback(() => {
    localStorage.removeItem(TOUR_STEP_KEY);
    localStorage.setItem(TOUR_DONE_KEY, 'true');
  }, []);

  const getCurrentStep = useCallback((): number | null => {
    const raw = localStorage.getItem(TOUR_STEP_KEY);
    if (!raw) return null;
    const num = parseInt(raw, 10);
    return isNaN(num) ? null : num;
  }, []);

  const advanceStep = useCallback((current: number) => {
    const next = current + 1;
    if (next > 5) {
      markDone();
      return;
    }
    const nextPage = TOUR_PAGES[next];
    localStorage.setItem(TOUR_STEP_KEY, String(next));
    return nextPage;
  }, [markDone]);

  const isTourDone = useCallback((): boolean => {
    return localStorage.getItem(TOUR_DONE_KEY) === 'true';
  }, []);

  const hasPendingTour = useCallback((): boolean => {
    return localStorage.getItem(TOUR_STEP_KEY) !== null;
  }, []);

  return { startTour, markDone, getCurrentStep, advanceStep, isTourDone, hasPendingTour };
}
