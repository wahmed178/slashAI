/**
 * Is this game currently inside the virtual handheld?
 *
 * The context lives in its own module rather than beside the component for a
 * concrete reason: GameBoyFrame is imported both relatively (from AppShell)
 * and by alias (from game routes). Keeping the context in a file that exports
 * nothing else guarantees a single instance, so a game can never end up talking
 * to a different context object than the one the shell provides — which
 * silently reads as `false` and leaves a duplicate d-pad on screen.
 *
 * Games use it to hide their own on-screen controls, since the shell already
 * has a hardware d-pad.
 */
import { createContext, useContext } from "react";

const DeviceContext = createContext(false);

export const DeviceProvider = DeviceContext.Provider;

/** true when the game is being rendered inside the handheld shell */
export function useInDevice(): boolean {
  return useContext(DeviceContext);
}
