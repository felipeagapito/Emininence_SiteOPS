"use client";

import { useState } from "react";

interface ExportButtonsProps {
  briefingJson: string;
  proposalMd: string;
  siteBuildPromptMd: string;
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Legacy clipboard path for non-secure contexts where `navigator.clipboard`
 * is absent (e.g. HTTP served on a LAN IP). Returns false when the browser
 * reports the copy did not succeed.
 */
function legacyCopy(content: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok;
}

/** Copies text to the clipboard, throwing when every available path fails. */
async function copyText(content: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }
  if (!legacyCopy(content)) {
    throw new Error("clipboard-unavailable");
  }
}

const COPY_FAILED_MESSAGE =
  "Nao foi possivel copiar. Selecione o texto e copie manualmente (Ctrl/Cmd + C).";

/** Read-only export actions: copy to clipboard or download the artifacts. */
export function ExportButtons({ briefingJson, proposalMd, siteBuildPromptMd }: ExportButtonsProps) {
  const [copied, setCopied] = useState<"briefing" | "proposal" | "prompt" | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  async function copy(content: string, kind: "briefing" | "proposal" | "prompt") {
    try {
      await copyText(content);
      setCopyError(null);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
      setCopyError(COPY_FAILED_MESSAGE);
      setTimeout(() => setCopyError(null), 4000);
    }
  }

  return (
    <div className="money-export">
      <span className="money-export-label">EXPORTAR</span>
      <div className="money-export-btns">
        <button type="button" onClick={() => copy(briefingJson, "briefing")}>
          {copied === "briefing" ? "Copiado!" : "Copiar briefing.json"}
        </button>
        <button type="button" onClick={() => downloadText(briefingJson, "briefing.json")}>
          Baixar briefing.json
        </button>
        <button type="button" onClick={() => copy(proposalMd, "proposal")}>
          {copied === "proposal" ? "Copiado!" : "Copiar proposal.md"}
        </button>
        <button type="button" onClick={() => downloadText(proposalMd, "proposal.md")}>
          Baixar proposal.md
        </button>
        <button type="button" onClick={() => copy(siteBuildPromptMd, "prompt")}>
          {copied === "prompt" ? "Copiado!" : "Copiar site-build-prompt.md"}
        </button>
        <button type="button" onClick={() => downloadText(siteBuildPromptMd, "site-build-prompt.md")}>
          Baixar site-build-prompt.md
        </button>
      </div>
      {copyError && (
        <p className="money-export-error" role="alert">
          {copyError}
        </p>
      )}
    </div>
  );
}
