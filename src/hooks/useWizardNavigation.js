/**
 * useWizardNavigation.js — Encapsulates wizard step navigation logic.
 */

import { useCallback } from "react";
import { useAHP } from "../context/AHPContext";
import { STEPS } from "../constants";

export function useWizardNavigation() {
  const { currentStep, setStep } = useAHP();

  const goNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) setStep(currentStep + 1);
  }, [currentStep, setStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) setStep(currentStep - 1);
  }, [currentStep, setStep]);

  const goTo = useCallback(
    (step) => {
      if (step >= 0 && step < STEPS.length) setStep(step);
    },
    [setStep]
  );

  const isFirst = currentStep === 0;
  const isLast  = currentStep === STEPS.length - 1;

  return { currentStep, goNext, goPrev, goTo, isFirst, isLast };
}
