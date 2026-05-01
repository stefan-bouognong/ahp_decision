/**
 * WizardProgress.jsx — Visual step progress indicator at the top of the wizard.
 */

import React from "react";
import { STEPS } from "../constants";
import { useAHP } from "../context/AHPContext";

export function WizardProgress() {
  const { currentStep, setStep, result } = useAHP();

  return (
    <nav aria-label="Wizard progress" style={{ marginBottom: "2rem" }}>
      {/* Step connectors + dots row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          position: "relative",
        }}
      >
        {STEPS.map((step, i) => {
          const done    = i < currentStep;
          const active  = i === currentStep;
          const canNav  = i < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Dot */}
              <button
                onClick={() => canNav && setStep(i)}
                style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  border: active
                    ? "2px solid var(--accent)"
                    : done
                    ? "2px solid var(--success)"
                    : "1px solid var(--border)",
                  background: active
                    ? "var(--accent)"
                    : done
                    ? "var(--success)"
                    : "var(--bg-surface)",
                  color: active || done ? "#fff" : "var(--text-muted)",
                  fontSize: 13, fontWeight: 600,
                  cursor: canNav ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  zIndex: 1, position: "relative",
                }}
                title={step.label}
                aria-current={active ? "step" : undefined}
              >
                {done ? "✓" : i + 1}
              </button>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1, height: 2,
                    background: i < currentStep ? "var(--success)" : "var(--border)",
                    transition: "background 0.3s",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current step label */}
      <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "space-between" }}>
        {STEPS.map((step, i) => (
          <div
            key={step.id}
            style={{
              flex: 1, textAlign: "center",
              color: i === currentStep ? "var(--text-primary)" : "var(--text-muted)",
              fontSize: 11, fontWeight: i === currentStep ? 500 : 400,
              transition: "color 0.2s",
            }}
          >
            {step.label}
          </div>
        ))}
      </div>
    </nav>
  );
}
