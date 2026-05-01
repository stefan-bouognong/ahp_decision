/**
 * Header.jsx — App header with branding and goal display.
 */

import React from "react";
import { useAHP } from "../context/AHPContext";

export function Header() {
  const { goal } = useAHP();

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "1rem 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        background: "var(--bg-surface)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            letterSpacing: "-0.01em",
            color: "var(--text-primary)",
          }}
        >
          AHP Decision Maker
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            padding: "2px 8px",
            borderRadius: "99px",
          }}
        >
          Analytic Hierarchy Process
        </span>
      </div>

      {goal && (
        <div
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            background: "var(--bg-raised)",
            border: "1px solid var(--border)",
            padding: "4px 12px",
            borderRadius: "99px",
            maxWidth: "340px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={goal}
        >
          Goal: {goal}
        </div>
      )}
    </header>
  );
}
