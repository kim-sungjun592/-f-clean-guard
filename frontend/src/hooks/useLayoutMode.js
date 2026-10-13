import { useEffect, useState } from "react";

// Single source of truth for which app shell to render. App.jsx reads
// this once to pick a route tree; nothing else needs to duplicate these
// checks.
//
// Three layouts, matching the reviewer's explicit split:
//   "mobile"    -- narrow AND portrait: the existing full-screen phone
//                  app, unchanged.
//   "landscape" -- a touch device that ISN'T narrow-portrait: a phone
//                  rotated horizontally, or a tablet in either
//                  orientation. Renders the new landscape/tablet
//                  dashboard.
//   "desktop"   -- everything else: a mouse/trackpad-driven browser
//                  window. Renders the existing desktop dashboard,
//                  untouched.
//
// "(pointer: coarse)" is what actually distinguishes "tablet" from
// "desktop browser window that happens to be tablet-width" -- a laptop
// resized to 1024px is still mouse-driven (pointer: fine), while a 12.9"
// iPad in landscape (1366px, wider than plenty of laptop windows) is
// still touch-driven (pointer: coarse). Width/orientation alone can't
// tell those apart; pointer type can.
const MOBILE_PORTRAIT_QUERY = "(max-width: 767px) and (orientation: portrait)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

function computeMode() {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia(MOBILE_PORTRAIT_QUERY).matches) return "mobile";
  if (window.matchMedia(COARSE_POINTER_QUERY).matches) return "landscape";
  return "desktop";
}

export function useLayoutMode() {
  const [mode, setMode] = useState(computeMode);

  useEffect(() => {
    const mqlPortrait = window.matchMedia(MOBILE_PORTRAIT_QUERY);
    const mqlPointer = window.matchMedia(COARSE_POINTER_QUERY);
    const handler = () => setMode(computeMode());

    mqlPortrait.addEventListener("change", handler);
    mqlPointer.addEventListener("change", handler);
    return () => {
      mqlPortrait.removeEventListener("change", handler);
      mqlPointer.removeEventListener("change", handler);
    };
  }, []);

  return mode;
}
