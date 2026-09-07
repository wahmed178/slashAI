import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/play")({
  component: PlayLayout,
  head: () => ({
    meta: [
      {
        title: "SlashPlay - Free Browser Games",
      },
      {
        name: "description",
        content:
          "Play 19+ free browser games - tic tac toe, connect four, battleship, blackjack, snake, 2048 and more. Multiplayer pass-and-play, no download, works offline.",
      },
    ],
  }),
});

function PlayLayout() {
  return <Outlet />;
}
