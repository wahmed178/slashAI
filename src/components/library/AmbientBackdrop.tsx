/**
 * A single fixed layer behind the whole app: two soft light pools and a faint
 * grid that never move.
 *
 * This used to chase the pointer on a rAF loop that wrote four custom
 * properties onto <html> every frame, and ran a delegated `pointermove`
 * listener that measured every card under the cursor. Both invalidate style /
 * layout for large parts of the document, which is why the site felt slow and
 * unresponsive whenever the mouse moved. The layer is now pure CSS: same light
 * wash, zero per-frame work.
 *
 * It sits at z-index 0 and every route renders above it; it never intercepts
 * pointer events.
 */
export function AmbientBackdrop() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <div className="ambient-pool ambient-pool-a" />
      <div className="ambient-pool ambient-pool-b" />
      <div className="ambient-grid" />
    </div>
  );
}

export default AmbientBackdrop;
