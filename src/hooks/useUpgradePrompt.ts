import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  FIRST_SEEN: 'QRBold_upgrade_first_seen',
  PROMPTS_SHOWN: 'QRBold_upgrade_prompts_shown',
  LAST_PROMPT: 'QRBold_upgrade_last_prompt_time',
};

const TRIGGER_DAYS = [3, 7, 21];

export function useUpgradePrompt() {
  const [showModal, setShowModal] = useState(false);
  const [triggerReason, setTriggerReason] = useState<'limit' | 'time' | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Initialize first seen
    let firstSeenStr = localStorage.getItem(STORAGE_KEYS.FIRST_SEEN);
    if (!firstSeenStr) {
      firstSeenStr = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.FIRST_SEEN, firstSeenStr);
    }

    const checkTimeTriggers = () => {
      try {
        const firstSeen = new Date(firstSeenStr!).getTime();
        const now = new Date().getTime();

        // Calculate days elapsed (rough measure)
        const daysElapsed = Math.floor((now - firstSeen) / (1000 * 60 * 60 * 24));

        const shownPrompts: number[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROMPTS_SHOWN) || '[]');
        const lastPromptTime = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_PROMPT) || '0', 10);

        // Prevent showing multiple times on the same day
        const hoursSinceLastPrompt = (now - lastPromptTime) / (1000 * 60 * 60);
        if (hoursSinceLastPrompt < 24) return;

        // Check if we hit any of the target days and haven't shown it yet
        for (const targetDay of TRIGGER_DAYS) {
          if (daysElapsed >= targetDay && !shownPrompts.includes(targetDay)) {
            // Found a trigger
            setTimeout(() => {
              setTriggerReason('time');
              setShowModal(true);

              // Mark as shown
              shownPrompts.push(targetDay);
              localStorage.setItem(STORAGE_KEYS.PROMPTS_SHOWN, JSON.stringify(shownPrompts));
              localStorage.setItem(STORAGE_KEYS.LAST_PROMPT, now.toString());
            }, 5000); // Wait 5 seconds after page load
            break;
          }
        }
      } catch (err) {
        console.error('Error checking upgrade triggers', err);
      }
    };

    // check triggers
    checkTimeTriggers();

    // Event listener for manual limit triggers
    const handleLimitTrigger = () => {
      setTriggerReason('limit');
      setShowModal(true);
    };

    window.addEventListener('QRBold_show_upgrade', handleLimitTrigger);
    return () => {
      window.removeEventListener('QRBold_show_upgrade', handleLimitTrigger);
    };
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    triggerReason,
    closeModal
  };
}

export const triggerUpgradeModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('QRBold_show_upgrade'));
  }
};
