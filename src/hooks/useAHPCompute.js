/**
 * useAHPCompute.js — Hook that triggers the AHP computation and
 * writes the result back into context. Separates compute logic from UI.
 */

import { useCallback } from "react";
import { useAHP } from "../context/AHPContext";
import { runAHP } from "../utils/ahp";
import { isMatrixComplete } from "../utils/ahp";
import { STEP_RESULTS } from "../constants";

export function useAHPCompute() {
  const {
    criteria,
    alternatives,
    criteriaMatrix,
    altMatrices,
    setResult,
    setStep,
  } = useAHP();

  /** Returns true when all matrices are complete and ready to compute */
  const canCompute = useCallback(() => {
    if (!isMatrixComplete(criteriaMatrix)) return false;
    for (let ci = 0; ci < criteria.length; ci++) {
      if (!altMatrices[ci] || !isMatrixComplete(altMatrices[ci])) return false;
    }
    return true;
  }, [criteria, criteriaMatrix, altMatrices]);

  /** Run the full AHP analysis and navigate to the results step */
  const compute = useCallback(() => {
    if (!canCompute()) return;

    const criteriaNames    = criteria.map((c) => c.name);
    const alternativeNames = alternatives.map((a) => a.name);
    const altMatricesArr   = criteria.map((_, ci) => altMatrices[ci]);

    const result = runAHP({
      criteriaNames,
      alternativeNames,
      criteriaMatrix,
      altMatrices: altMatricesArr,
    });

    setResult(result);
    setStep(STEP_RESULTS);
  }, [canCompute, criteria, alternatives, criteriaMatrix, altMatrices, setResult, setStep]);

  return { compute, canCompute };
}
