import { useState, type CSSProperties, type ReactNode } from "react";

export const card: CSSProperties = {
  border: "1px solid var(--color-line)",
  borderRadius: "var(--radius-card)",
  background: "var(--color-panel)",
  padding: "1rem",
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "var(--color-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "0.5rem",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.625rem 0.875rem",
  fontSize: "0.875rem",
  background: "var(--color-paper)",
  color: "var(--color-ink)",
  border: "1px solid var(--color-line)",
  borderRadius: "var(--radius-btn)",
  fontFamily: "var(--font-mono)",
};

export const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: "8rem",
  lineHeight: 1.5,
};

export const selectStyle: CSSProperties = {
  ...inputStyle,
  fontFamily: "var(--font-body)",
  cursor: "pointer",
};

export const buttonStyle: CSSProperties = {
  padding: "0.5rem 0.875rem",
  borderRadius: "var(--radius-btn)",
  border: "1px solid var(--color-line)",
  background: "var(--color-panel)",
  color: "var(--color-ink)",
  fontSize: "0.8125rem",
  fontWeight: 600,
};

export const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  border: "none",
  background: "var(--color-accent)",
  color: "#fff",
};

export const sectionTitle: CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "1.25rem",
  fontWeight: 700,
  margin: "0 0 0.25rem",
};

export const sectionSubtitle: CSSProperties = {
  color: "var(--color-muted)",
  fontSize: "0.875rem",
  margin: "0 0 1.25rem",
};

export const rowGap: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

export function Section(props: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div>
      <h2 style={sectionTitle}>{props.title}</h2>
      {props.subtitle && <p style={sectionSubtitle}>{props.subtitle}</p>}
      <div style={rowGap}>{props.children}</div>
    </div>
  );
}

export function CopyButton(props: { text: string; label?: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!props.text) return;
    try {
      await navigator.clipboard.writeText(props.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={copy}
      style={{
        ...buttonStyle,
        padding: props.small ? "0.25rem 0.5rem" : "0.5rem 0.875rem",
        fontSize: props.small ? "0.75rem" : "0.8125rem",
        color: copied ? "var(--color-accent)" : "var(--color-ink)",
      }}
      type="button"
    >
      {copied ? "Copied" : props.label ?? "Copy"}
    </button>
  );
}

export function Toggle(props: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        fontSize: "0.8125rem",
        color: "var(--color-ink)",
      }}
    >
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        style={{ accentColor: "var(--color-accent)" }}
      />
      <span>{props.label}</span>
    </label>
  );
}

export function Pill(props: { children: ReactNode; tone?: "muted" | "accent" | "warn" }) {
  const tone = props.tone ?? "muted";
  const styles: Record<string, CSSProperties> = {
    muted: { background: "var(--color-line)", color: "var(--color-muted)" },
    accent: { background: "var(--color-accent)", color: "#fff" },
    warn: { background: "#dc2626", color: "#fff" },
  };
  return (
    <span
      style={{
        ...styles[tone],
        display: "inline-block",
        padding: "0.125rem 0.5rem",
        borderRadius: "999px",
        fontSize: "0.6875rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {props.children}
    </span>
  );
}

export function FieldRow(props: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}
    >
      {props.children}
    </div>
  );
}
