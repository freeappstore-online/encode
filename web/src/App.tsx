import { useState } from "react";
import { Base64Tool } from "./tools/Base64Tool";
import { UrlTool } from "./tools/UrlTool";
import { HtmlEntitiesTool } from "./tools/HtmlEntitiesTool";
import { JwtTool } from "./tools/JwtTool";
import { HashTool } from "./tools/HashTool";
import { UuidTool } from "./tools/UuidTool";
import { TimestampTool } from "./tools/TimestampTool";
import { ColorTool } from "./tools/ColorTool";
import { UnitTool } from "./tools/UnitTool";
import { LoremTool } from "./tools/LoremTool";

type ToolId =
  | "base64"
  | "url"
  | "html"
  | "jwt"
  | "hash"
  | "uuid"
  | "timestamp"
  | "color"
  | "unit"
  | "lorem";

type ToolDef = {
  id: ToolId;
  label: string;
  hint: string;
};

const TOOLS: ToolDef[] = [
  { id: "base64", label: "Base64", hint: "Encode / decode" },
  { id: "url", label: "URL", hint: "Percent encoding" },
  { id: "html", label: "HTML", hint: "Entities" },
  { id: "jwt", label: "JWT", hint: "Decode tokens" },
  { id: "hash", label: "Hash", hint: "MD5 / SHA" },
  { id: "uuid", label: "UUID", hint: "v4 generator" },
  { id: "timestamp", label: "Timestamp", hint: "Epoch / ISO" },
  { id: "color", label: "Color", hint: "HEX / RGB / HSL" },
  { id: "unit", label: "Unit", hint: "Length / weight / …" },
  { id: "lorem", label: "Lorem", hint: "Ipsum generator" },
];

export function App() {
  const [active, setActive] = useState<ToolId>("base64");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-body)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--color-line)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Encode
        </h1>
        <a
          href="https://freeappstore.online"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "var(--color-muted)",
            fontSize: "0.75rem",
            textDecoration: "none",
          }}
        >
          Part of FreeAppStore — free forever
        </a>
      </header>

      <nav
        style={{
          borderBottom: "1px solid var(--color-line)",
          padding: "0.75rem 1rem",
          overflowX: "auto",
          display: "flex",
          gap: "0.5rem",
          background: "var(--color-paper)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {TOOLS.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                flexShrink: 0,
                padding: "0.5rem 0.875rem",
                borderRadius: "var(--radius-btn)",
                border: isActive ? "none" : "1px solid var(--color-line)",
                background: isActive ? "var(--color-accent)" : "var(--color-panel)",
                color: isActive ? "#fff" : "var(--color-ink)",
                fontSize: "0.875rem",
                fontWeight: 600,
                transition: "background 0.15s, color 0.15s",
              }}
              title={t.hint}
            >
              {t.label}
            </button>
          );
        })}
      </nav>

      <main style={{ maxWidth: "48rem", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
        {active === "base64" && <Base64Tool />}
        {active === "url" && <UrlTool />}
        {active === "html" && <HtmlEntitiesTool />}
        {active === "jwt" && <JwtTool />}
        {active === "hash" && <HashTool />}
        {active === "uuid" && <UuidTool />}
        {active === "timestamp" && <TimestampTool />}
        {active === "color" && <ColorTool />}
        {active === "unit" && <UnitTool />}
        {active === "lorem" && <LoremTool />}
      </main>
    </div>
  );
}
