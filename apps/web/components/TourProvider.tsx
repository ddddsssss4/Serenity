"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useTour, TOUR_PAGES } from '../lib/useTour';

const TOUR_CONFIGS: Record<number, () => void> = {};

export function TourProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { getCurrentStep, advanceStep, markDone } = useTour();
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Reset on each page navigation
    hasRunRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (hasRunRef.current) return;

    const step = getCurrentStep();
    if (!step) return;

    const expectedPage = TOUR_PAGES[step];
    if (pathname !== expectedPage) return;

    hasRunRef.current = true;

    // Small delay so DOM is fully rendered
    const timer = setTimeout(() => {
      runStep(step);
    }, 600);

    return () => clearTimeout(timer);
  });

  function runStep(step: number) {
    const onNext = () => {
      const nextPage = advanceStep(step);
      if (nextPage) {
        router.push(nextPage);
      }
    };

    const onDone = () => {
      if (step < 5) {
        // User closed early
      } else {
        markDone();
      }
    };

    if (step === 1) {
      const d = driver({
        showProgress: true,
        smoothScroll: true,
        allowClose: true,
        onDestroyed: onDone,
        steps: [
          {
            element: '#tour-journal-textarea',
            popover: {
              title: '📖 Your Serenity Journal',
              description:
                'Think of this as your private diary. Write whatever is on your mind — your experiences, feelings, or reflections. Serenity reads each entry to build a personal memory of you, so future conversations feel truly tailored to you.',
              side: 'top',
              align: 'start',
              nextBtnText: 'Got it →',
              onNextClick: () => {
                d.destroy();
                onNext();
              },
            },
          },
        ],
      });
      d.drive();
    } else if (step === 2) {
      const d = driver({
        showProgress: true,
        smoothScroll: true,
        allowClose: true,
        onDestroyed: onDone,
        steps: [
          {
            element: '#tour-memory-panel',
            popover: {
              title: '🧠 Your Memory Bank',
              description:
                'These are the memories Serenity has built from your journal entries and past conversations. The more you write, the better Serenity understands your patterns, emotions, and what truly matters to you.',
              side: 'right',
              align: 'start',
              nextBtnText: 'Next →',
              onNextClick: () => {
                d.destroy();
                // Stay on reflection, advance visually to step 3
                localStorage.setItem('serenity_tour_step', '3');
                hasRunRef.current = false;
                setTimeout(() => runStep(3), 300);
              },
            },
          },
        ],
      });
      d.drive();
    } else if (step === 3) {
      const d = driver({
        showProgress: true,
        smoothScroll: true,
        allowClose: true,
        onDestroyed: onDone,
        steps: [
          {
            element: '#tour-chat-input',
            popover: {
              title: '💬 Chat with Serenity',
              description:
                'Ask anything that\'s on your mind. Because Serenity already knows your past memories and emotional patterns, every response is deeply personalised — not generic advice, but guidance crafted just for you.',
              side: 'top',
              align: 'start',
              nextBtnText: 'Next →',
              onNextClick: () => {
                d.destroy();
                onNext();
              },
            },
          },
        ],
      });
      d.drive();
    } else if (step === 4) {
      const d = driver({
        showProgress: true,
        smoothScroll: true,
        allowClose: true,
        onDestroyed: onDone,
        steps: [
          {
            element: '#tour-voice-mic',
            popover: {
              title: '🎙️ Voice Agent',
              description:
                'Prefer talking over typing? Tap the mic and have a real conversation with Serenity. The voice agent responds in real time, making it feel like a genuine heart-to-heart session.',
              side: 'top',
              align: 'center',
              nextBtnText: 'Next →',
              onNextClick: () => {
                d.destroy();
                onNext();
              },
            },
          },
        ],
      });
      d.drive();
    } else if (step === 5) {
      const d = driver({
        showProgress: true,
        smoothScroll: true,
        allowClose: true,
        onDestroyed: markDone,
        steps: [
          {
            element: '#tour-community',
            popover: {
              title: '🌿 Your Community',
              description:
                'You\'re not alone on this journey. Connect with like-minded people, share your thoughts in circles, and grow together. Full community features are coming very soon — stay tuned!',
              side: 'top',
              align: 'start',
              nextBtnText: 'Finish Tour 🎉',
              onNextClick: () => {
                d.destroy();
                markDone();
                router.push('/sanctuary');
              },
            },
          },
        ],
      });
      d.drive();
    }
  }

  return <>{children}</>;
}
