import { useCallback, useEffect, useState } from "react";

export const PROJECT_STAGES = ["Idea", "Validating", "Planning", "Building", "Launched"] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export interface IdeaProject {
  ideaId: string;
  slug: string;
  title: string;
  stage: ProjectStage;
  notes: string;
  updatedAt: string;
}

export interface ValidationRecord {
  id: string;
  input: string;
  result: unknown;
  createdAt: string;
}

const KEYS = {
  saved: "slashai:ideas:saved",
  projects: "slashai:ideas:projects",
  specs: "slashai:ideas:specs",
  validations: "slashai:ideas:validations",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

/** Device-local saved ideas + project tracker. No account needed. */
export function useIdeaLibrary() {
  const [saved, setSaved] = useState<string[]>([]);
  const [projects, setProjects] = useState<IdeaProject[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(read<string[]>(KEYS.saved, []));
    setProjects(read<IdeaProject[]>(KEYS.projects, []));
    setReady(true);
  }, []);

  const toggleSaved = useCallback((ideaId: string) => {
    setSaved((prev) => {
      const next = prev.includes(ideaId) ? prev.filter((x) => x !== ideaId) : [ideaId, ...prev];
      write(KEYS.saved, next);
      return next;
    });
  }, []);

  const removeSaved = useCallback((ideaId: string) => {
    setSaved((prev) => {
      const next = prev.filter((x) => x !== ideaId);
      write(KEYS.saved, next);
      return next;
    });
  }, []);

  const upsertProject = useCallback((project: Partial<IdeaProject> & { ideaId: string }) => {
    setProjects((prev) => {
      const existing = prev.find((p) => p.ideaId === project.ideaId);
      const merged: IdeaProject = {
        slug: project.slug ?? existing?.slug ?? "",
        title: project.title ?? existing?.title ?? "",
        stage: project.stage ?? existing?.stage ?? "Idea",
        notes: project.notes ?? existing?.notes ?? "",
        ideaId: project.ideaId,
        updatedAt: new Date().toISOString(),
      };
      const next = existing
        ? prev.map((p) => (p.ideaId === project.ideaId ? merged : p))
        : [merged, ...prev];
      write(KEYS.projects, next);
      return next;
    });
  }, []);

  const removeProject = useCallback((ideaId: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.ideaId !== ideaId);
      write(KEYS.projects, next);
      return next;
    });
  }, []);

  return { ready, saved, projects, toggleSaved, removeSaved, upsertProject, removeProject };
}

/** Per-idea spec cache so repeat opens are instant and work offline. */
export function readSpecCache(slug: string): string | null {
  const all = read<Record<string, string>>(KEYS.specs, {});
  return all[slug] ?? null;
}

export function writeSpecCache(slug: string, spec: string) {
  const all = read<Record<string, string>>(KEYS.specs, {});
  all[slug] = spec;
  write(KEYS.specs, all);
}

export function readValidations(): ValidationRecord[] {
  return read<ValidationRecord[]>(KEYS.validations, []);
}

export function saveValidation(record: ValidationRecord) {
  const all = readValidations();
  write(KEYS.validations, [record, ...all].slice(0, 25));
}
