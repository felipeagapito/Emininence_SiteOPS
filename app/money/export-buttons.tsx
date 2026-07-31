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

/** Read-only export actions: copy to clipboard or download the artifacts. */
export function ExportButtons({ briefingJson, proposalMd, siteBuildPromptMd }: ExportButtonsProps) {
  const [copied, setCopied] = useState<"briefing" | "proposal" | "prompt" | null>(null);

  async function copy(content: string, kind: "briefing" | "proposal" | "prompt") {
    await navigator.clipboard.writeText(content);
    setCopied(kind);
    setTimeout(() => setCopied(null), 1500);
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
    </div>
  );
}
