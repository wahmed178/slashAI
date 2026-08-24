import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  askOpenRouter,
  SPEC_SYSTEM,
  VALIDATE_SYSTEM,
  specPrompt,
} from "@/lib/build-ideas.server";

export const generateSpec = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        title: z.string().min(1),
        short: z.string(),
        problem: z.string(),
        targetUsers: z.string(),
        solution: z.string(),
        keyFeatures: z.array(z.string()),
        mvpFeatures: z.array(z.string()),
        techStack: z.array(z.string()),
        businessModel: z.string(),
        buildType: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => ({ markdown: await askOpenRouter(SPEC_SYSTEM, specPrompt(data)) }));

export const validateIdea = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ idea: z.string().min(20).max(4000) }).parse(data))
  .handler(async ({ data }) => ({
    json: await askOpenRouter(VALIDATE_SYSTEM, `Evaluate this startup idea:\n\n${data.idea}`),
  }));
