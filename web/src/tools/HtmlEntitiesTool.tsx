import { useMemo, useState } from "react";
import {
  CopyButton,
  FieldRow,
  Section,
  Toggle,
  buttonStyle,
  card,
  labelStyle,
  textareaStyle,
} from "../lib/ui";

type Mode = "encode" | "decode";

const NAMED: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  " ": "&nbsp;",
};

function encodeHtml(s: string, allNonAscii: boolean): string {
  let out = "";
  for (const ch of s) {
    const named = NAMED[ch];
    if (named) {
      out += named;
      continue;
    }
    const cp = ch.codePointAt(0)!;
    if (allNonAscii && cp > 127) {
      out += `&#${cp};`;
    } else {
      out += ch;
    }
  }
  return out;
}

function decodeHtml(s: string): string {
  // Decode named entities via a temp DOM element.
  const ta = document.createElement("textarea");
  ta.innerHTML = s;
  return ta.value;
}

export function HtmlEntitiesTool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [allNonAscii, setAllNonAscii] = useState(false);
  const [input, setInput] = useState('<div class="hello">Hi & welcome — café</div>');

  const output = useMemo(() => {
    if (!input) return "";
    return mode === "encode" ? encodeHtml(input, allNonAscii) : decodeHtml(input);
  }, [input, mode, allNonAscii]);

  return (
    <Section
      title="HTML entities"
      subtitle="Encode reserved HTML characters or decode named/numeric entities back to text."
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
          {mode === "encode" && (
            <Toggle
              checked={allNonAscii}
              onChange={setAllNonAscii}
              label="Encode all non-ASCII"
            />
          )}
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
      </div>
    </Section>
  );
}
