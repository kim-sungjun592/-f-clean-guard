import { useEffect, useState } from "react";
import { getSensors } from "../services/api";

const POLL_INTERVAL_MS = 3000;

// Drives the mobile Bathroom Detail screen's row data.
//
// Live/Test: keeps polling getSensors(mode) and picks out this one
// device's latest reading, so the detail screen stays current while the
// user is looking at it -- same data source as the main list, just
// filtered to one id. History: a historical record is a fixed point in
// time, so this hook does nothing and simply keeps the row the user
// tapped (passed in as initialRow via router state). If the screen is
// opened directly (e.g. a refresh, no router state), it falls back to a
// one-time Live/Test fetch by id instead of showing a blank screen.
export function useBathroomDetail({ id, mode, initialRow }) {
  const [row, setRow] = useState(initialRow ?? null);
  const [loading, setLoading] = useState(!initialRow && mode !== "history");
  const autoRefresh = mode === "live" || mode === "test";

  useEffect(() => {
    if (!autoRefresh || !id) return;

    let cancelled = false;

    const fetchOne = () => {
      getSensors(mode).then((rows) => {
        if (cancelled) return;
        const found = rows.find((r) => String(r.id) === String(id));
        if (found) setRow(found);
        setLoading(false);
      });
    };

    fetchOne();
    const interval = setInterval(fetchOne, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [id, mode, autoRefresh]);

  // Computed rather than set via state in the effect's early-return branch
  // -- when there's nothing to auto-refresh (History mode, or no id yet)
  // there's simply nothing to wait on, so loading is always false here.
  return { row, loading: autoRefresh ? loading : false };
}
