import { useState } from "react";
import {
  hexToRgb,
  hslToRgb,
  hsvToRgb,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  type RGB,
} from "../lib/color";
import {
  CopyButton,
  FieldRow,
  Section,
  card,
  inputStyle,
  labelStyle,
} from "../lib/ui";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function ColorTool() {
  const [rgb, setRgb] = useState<RGB>({ r: 37, g: 99, b: 235 });

  const hex = rgbToHex(rgb);
  const hsl = rgbToHsl(rgb);
  const hsv = rgbToHsv(rgb);

  function onHex(v: string) {
    const next = hexToRgb(v);
    if (next) setRgb(next);
  }

  function onRgb(channel: "r" | "g" | "b", v: string) {
    const n = clamp(parseInt(v, 10) || 0, 0, 255);
    setRgb({ ...rgb, [channel]: n });
  }

  function onHsl(channel: "h" | "s" | "l", v: string) {
    const n = parseInt(v, 10) || 0;
    const next = {
      h: channel === "h" ? clamp(n, 0, 360) : hsl.h,
      s: channel === "s" ? clamp(n, 0, 100) : hsl.s,
      l: channel === "l" ? clamp(n, 0, 100) : hsl.l,
    };
    setRgb(hslToRgb(next));
  }

  function onHsv(channel: "h" | "s" | "v", v: string) {
    const n = parseInt(v, 10) || 0;
    const next = {
      h: channel === "h" ? clamp(n, 0, 360) : hsv.h,
      s: channel === "s" ? clamp(n, 0, 100) : hsv.s,
      v: channel === "v" ? clamp(n, 0, 100) : hsv.v,
    };
    setRgb(hsvToRgb(next));
  }

  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hsvStr = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;

  const numInput: React.CSSProperties = {
    ...inputStyle,
    fontFamily: "var(--font-mono)",
    width: "5rem",
    padding: "0.5rem 0.625rem",
  };

  return (
    <Section title="Color" subtitle="Convert between HEX, RGB, HSL, and HSV with a live preview.">
      <div style={{ ...card, display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "5rem",
            height: "5rem",
            borderRadius: "var(--radius-card)",
            background: hex,
            border: "1px solid var(--color-line)",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <FieldRow>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "1rem" }}>{hex}</span>
            <CopyButton text={hex} small />
          </FieldRow>
          <FieldRow>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              {rgbStr}
            </span>
            <CopyButton text={rgbStr} small />
          </FieldRow>
          <FieldRow>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              {hslStr}
            </span>
            <CopyButton text={hslStr} small />
          </FieldRow>
          <FieldRow>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8125rem", color: "var(--color-muted)" }}>
              {hsvStr}
            </span>
            <CopyButton text={hsvStr} small />
          </FieldRow>
        </div>
      </div>

      <div style={card}>
        <label style={labelStyle}>HEX</label>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            type="color"
            value={hex}
            onChange={(e) => onHex(e.target.value)}
            style={{
              width: "3rem",
              height: "2.5rem",
              border: "1px solid var(--color-line)",
              borderRadius: "var(--radius-btn)",
              background: "transparent",
              padding: 0,
              cursor: "pointer",
            }}
          />
          <input
            style={{ ...inputStyle, flex: 1 }}
            value={hex}
            onChange={(e) => onHex(e.target.value)}
            spellCheck={false}
          />
        </div>
      </div>

      <div style={card}>
        <label style={labelStyle}>RGB</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["r", "g", "b"] as const).map((c) => (
            <label
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
              }}
            >
              <span style={{ color: "var(--color-muted)", width: "1rem" }}>
                {c.toUpperCase()}
              </span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[c]}
                onChange={(e) => onRgb(c, e.target.value)}
                style={numInput}
              />
            </label>
          ))}
        </div>
      </div>

      <div style={card}>
        <label style={labelStyle}>HSL</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["h", "s", "l"] as const).map((c) => (
            <label
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
              }}
            >
              <span style={{ color: "var(--color-muted)", width: "1.5rem" }}>
                {c.toUpperCase()}
                {c !== "h" && "%"}
              </span>
              <input
                type="number"
                min={0}
                max={c === "h" ? 360 : 100}
                value={hsl[c]}
                onChange={(e) => onHsl(c, e.target.value)}
                style={numInput}
              />
            </label>
          ))}
        </div>
      </div>

      <div style={card}>
        <label style={labelStyle}>HSV</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["h", "s", "v"] as const).map((c) => (
            <label
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.8125rem",
              }}
            >
              <span style={{ color: "var(--color-muted)", width: "1.5rem" }}>
                {c.toUpperCase()}
                {c !== "h" && "%"}
              </span>
              <input
                type="number"
                min={0}
                max={c === "h" ? 360 : 100}
                value={hsv[c]}
                onChange={(e) => onHsv(c, e.target.value)}
                style={numInput}
              />
            </label>
          ))}
        </div>
      </div>
    </Section>
  );
}
