/**
 * ui/index.jsx — Shared primitive UI components.
 * No business logic, no AHP knowledge.
 */

import React from "react";

// ─── StepHeader ───────────────────────────────────────────────
export function StepHeader({ number, title, subtitle }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
        <div
          style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--accent)", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 600, flexShrink: 0,
          }}
        >
          {number}
        </div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 500, color: "var(--text-primary)" }}>{title}</h2>
      </div>
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", fontSize: 14, paddingLeft: 44 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Alert ────────────────────────────────────────────────────
export function Alert({ type = "info", icon, children, style }) {
  return (
    <div className={`alert alert-${type}`} style={style}>
      {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
      <div>{children}</div>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ color = "blue", children }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

// ─── ProgressBar ──────────────────────────────────────────────
export function ProgressBar({ value, color = "var(--accent)", height = 8 }) {
  return (
    <div
      className="progress-bar-wrap"
      style={{ height, borderRadius: height / 2 }}
    >
      <div
        className="progress-bar-fill"
        style={{
          width: `${Math.min(100, value * 100)}%`,
          background: color,
          height: "100%",
          borderRadius: height / 2,
        }}
      />
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────
export function Divider({ spacing = "1.5rem" }) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--border)",
        margin: `${spacing} 0`,
      }}
    />
  );
}

// ─── SectionTitle ─────────────────────────────────────────────
export function SectionTitle({ children, action }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "0.75rem",
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {children}
      </h3>
      {action}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────
export function EmptyState({ icon, title, description }) {
  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
      {icon && <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>}
      <p style={{ fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>{title}</p>
      {description && <p style={{ fontSize: 13 }}>{description}</p>}
    </div>
  );
}
