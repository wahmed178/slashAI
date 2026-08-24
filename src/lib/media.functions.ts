import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { MovieHit, VideoHit } from "./media-types";

export type { MovieHit, VideoHit };

/** Keyless YouTube/music search, played back through youtube-nocookie embeds. */
export const searchVideos = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ q: z.string().trim().min(1).max(120), music: z.boolean() }).parse(data),
  )
  .handler(async ({ data }): Promise<{ hits: VideoHit[]; degraded: boolean }> => {
    const { runVideoSearch } = await import("./media.server");
    return runVideoSearch(data.q, data.music);
  });

/** Free-text movie search across IMDb metadata. */
export const searchMovies = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ q: z.string().trim().max(120) }).parse(data))
  .handler(async ({ data }): Promise<MovieHit[]> => {
    const { runMovieSearch } = await import("./media.server");
    return data.q ? runMovieSearch(data.q) : [];
  });

/** Curated regional shelf (Hindi, Telugu, Urdu, Nepali, …). */
export const regionalMovies = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ lang: z.string().trim().max(20) }).parse(data))
  .handler(async ({ data }): Promise<MovieHit[]> => {
    const { runRegionalShelf } = await import("./media.server");
    return runRegionalShelf(data.lang);
  });

/** Full detail for one title. */
export const movieDetail = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ id: z.string().trim().max(20) }).parse(data))
  .handler(async ({ data }): Promise<MovieHit | null> => {
    const { runMovieDetail } = await import("./media.server");
    return runMovieDetail(data.id);
  });
