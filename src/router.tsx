import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Preload a route's code as soon as a link is hovered or touched, so
    // tapping a SlashKit opens the tool instead of a pending screen.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  return router;
};
