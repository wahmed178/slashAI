import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { runGeneratorOnServer } from "@/lib/generators.server";

export const runGenerator = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        id: z.string().min(1),
        fields: z.record(z.string(), z.string().max(4000)),
      })
      .parse(data),
  )
  .handler(async ({ data }) => ({
    markdown: await runGeneratorOnServer(data.id, data.fields),
  }));
