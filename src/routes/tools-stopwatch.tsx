import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/library/AppShell";

export const Route = createFileRoute("/tools-stopwatch")({ component: ToolComponent });

function ToolComponent() {
  return (
    <AppShell title="Precision stopwatch with lap times">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">⏱️ Stopwatch Precision stopwatch with lap times</h1>
        <p className="mt-1 text-sm text-muted-foreground"></p>
      </header>
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-4xl mb-3">⏱️ Stopwatch</p>
          <p className="text-sm text-muted-foreground">Coming soon — this tool is under construction.</p>
        </div>
      </div>
    </AppShell>
  );
}
