import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools-alphabet-cipher")({ component: ToolComponent });

function ToolComponent() {
  return (
    <AppShell title="Encode/decode messages with Caesar cipher">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">🔐 Alphabet Cipher Encode/decode messages with Caesar cipher</h1>
        <p className="mt-1 text-sm text-muted-foreground"></p>
      </header>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-4xl mb-3">🔐 Alphabet Cipher</p>
          <p className="text-sm text-muted-foreground">Coming soon — this tool is under construction.</p>
        </div>
      </div>
    </AppShell>
  );
}
