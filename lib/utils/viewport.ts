let probe: HTMLDivElement | null = null;

/**
 * The viewport height with mobile browser toolbars retracted (CSS `100lvh`).
 *
 * Unlike `window.innerHeight`, this doesn't change when iOS Safari's address
 * bar collapses or expands mid-scroll, so layout maths based on it (sticky
 * offsets, scroll progress) doesn't jump. It still updates on rotation.
 */
export function largeViewportHeight(): number {
  if (!probe) {
    probe = document.createElement("div");
    // 100vh first as a fallback; browsers without lvh drop the second value.
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none;";
    probe.setAttribute("aria-hidden", "true");
    document.body.appendChild(probe);
  }
  return probe.offsetHeight;
}
