import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/play")({
  component: PlayLayout,
  // The generic SlashPlay title/description must only apply to the /play
  // index page — child game pages get their own titles from the central
  // registry in src/lib/seo.ts (emit them here only when no child matched).
  head: ({ matches }: { matches: Array<{ pathname: string }> }) => {
    if (matches.some((m) => m.pathname !== "/play")) return {};
    return {
      meta: [
        { title: "SlashPlay - Free Browser Games" },
        {
          name: "description",
          content:
            "Play 19+ free browser games - tic tac toe, connect four, battleship, blackjack, snake, 2048 and more. Multiplayer pass-and-play, no download, works offline.",
        },
      ],
    };
  },
});

function PlayLayout() {
  return <Outlet />;
}
