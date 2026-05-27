import { useMemo, useState } from "react";
import {
  CopyButton,
  FieldRow,
  Section,
  buttonStyle,
  card,
  labelStyle,
  textareaStyle,
} from "../lib/ui";

type Mode = "encode" | "decode";
type Scope = "component" | "full";

export function UrlTool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [scope, setScope] = useState<Scope>("component");
  const [input, setInput] = useState("https://example.com/path?q=hello world&x=1");

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (mode === "encode") {
        return {
          output:
            scope === "component" ? encodeURIComponent(input) : encodeURI(input),
          error: null,
        };
      }
      return {
        output: scope === "component" ? decodeURIComponent(input) : decodeURI(input),
        error: null,
      };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid input" };
    }
  }, [input, mode, scope]);

  return (
    <Section
      title="URL"
      subtitle="Percent-encode or decode URLs. Use component mode for query values, full-URL for entire URLs."
    >
      <div style={card}>
        <FieldRow>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setMode("encode")}
              style={{
                ...buttonStyle,
                background: mode === "encode" ? "var(--color-accent)" : "var(--color-panel)",
                color: mode === "encode" ? "#fff" : "var(--color-ink)",
                border: mode === "encode" ? "none" : "1px solid var(--color-line)",
              }}
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              style={{
                ...buttonStyle,
                background: mode === "decode" ? "var(--color-accent)" : "var(--color-panel)",
                color: mode === "decode" ? "#fff" : "var(--color-ink)",
                border: mode === "decode" ? "none" : "1px solid var(--color-line)",
              }}
            >
              Decode
            </button>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setScope("component")}
              style={{
                ...buttonStyle,
                background:
                  scope === "component" ? "var(--color-accent)" : "var(--color-panel)",
                color: scope === "component" ? "#fff" : "var(--color-ink)",
                border: scope === "component" ? "none" : "1px solid var(--color-line)",
              }}
            >
              Component
            </button>
            <button
              onClick={() => setScope("full")}
              style={{
                ...buttonStyle,
                background: scope === "full" ? "var(--color-accent)" : "var(--color-panel)",
                color: scope === "full" ? "#fff" : "var(--color-ink)",
                border: scope === "full" ? "none" : "1px solid var(--color-line)",
              }}
            >
              Full URL
            </button>
          </div>
        </FieldRow>
      </div>

      <div>
        <label style={labelStyle}>Input</label>
        <textarea
          style={textareaStyle}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div>
        <FieldRow>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Output</label>
          <CopyButton text={output} />
        </FieldRow>
        <textarea
          style={{ ...textareaStyle, marginTop: "0.5rem" }}
          value={output}
          readOnly
          spellCheck={false}
        />
        {error && (
          <p style={{ color: "#dc2626", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
            {error}
          </p>
        )}
      </div>
    </Section>
  );
}
