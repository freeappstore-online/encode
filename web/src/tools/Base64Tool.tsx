import { useMemo, useRef, useState } from "react";
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

function bytesToBase64(bytes: Uint8Array, urlSafe: boolean): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  let b64 = btoa(binary);
  if (urlSafe) {
    b64 = b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  return b64;
}

function base64ToBytes(b64: string, urlSafe: boolean): Uint8Array {
  let s = b64.trim();
  if (urlSafe) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4 !== 0) s += "=";
  }
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function byteLen(s: string): number {
  return new TextEncoder().encode(s).length;
}

export function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("Hello, world!");
  // When the user uploads a file we encode it directly and pin the output,
  // so the result is visible even though `input` shows a placeholder.
  const [filePin, setFilePin] = useState<
    | { name: string; inputBytes: number; output: string }
    | null
  >(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const computed = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (mode === "encode") {
        return {
          output: bytesToBase64(new TextEncoder().encode(input), urlSafe),
          error: null,
        };
      }
      const bytes = base64ToBytes(input, urlSafe);
      return { output: new TextDecoder().decode(bytes), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
    }
  }, [input, mode, urlSafe]);

  const output = filePin ? filePin.output : computed.output;
  const error = filePin ? null : computed.error;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const b64 = bytesToBase64(bytes, urlSafe);
    setMode("encode");
    setInput(`[file: ${f.name}]`);
    setFilePin({ name: f.name, inputBytes: bytes.length, output: b64 });
    e.target.value = "";
  }

  function clearFile() {
    setFilePin(null);
    setInput("");
  }

  const inLen = filePin ? filePin.inputBytes : byteLen(input);
  const outLen = byteLen(output);

  return (
    <Section
      title="Base64"
      subtitle="Encode or decode text and files. Toggle URL-safe variant if needed."
    >
      <div style={card}>
        <FieldRow>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => {
                setMode("encode");
                setFilePin(null);
              }}
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
              onClick={() => {
                setMode("decode");
                setFilePin(null);
              }}
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
          <Toggle checked={urlSafe} onChange={setUrlSafe} label="URL-safe" />
        </FieldRow>
      </div>

      <div>
        <label style={labelStyle}>
          Input — {inLen.toLocaleString()} bytes
          {filePin && ` · file: ${filePin.name}`}
        </label>
        <textarea
          style={textareaStyle}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFilePin(null);
          }}
          placeholder={mode === "encode" ? "Enter text…" : "Paste Base64…"}
          spellCheck={false}
          readOnly={filePin !== null}
        />
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button style={buttonStyle} onClick={() => fileRef.current?.click()}>
            Encode a file…
          </button>
          {filePin && (
            <button style={buttonStyle} onClick={clearFile}>
              Clear file
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            onChange={onFile}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div>
        <FieldRow>
          <label style={{ ...labelStyle, marginBottom: 0 }}>
            Output — {outLen.toLocaleString()} bytes
          </label>
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
