import { useEffect, useState } from "react";
import { getSensors } from "../services/api";

const POLL_INTERVAL_MS = 2000;

// Drives the Live / Test dashboard grid -- exactly one row per device,
// refreshed every couple of seconds.
//
// History mode is deliberately NOT served by this hook. It used to take a
// one-time snapshot of the "live" table here, which was the bug reported:
// Live and History rendered the same latest-reading-per-device data.
// History now has its own data path (see hooks/useHistoryLog.js +
// components/HistoryPanel.jsx) that reads every row from `sensor_data`,
// paginated and newest-first, and is only mounted while History mode is
// active -- so this hook simply does nothing when mode is "history",
// keeping Live mode's polling cheap and untouched by History's much
// larger payloads.
export function useSensorData(mode) {
  const [data, setData] = useState([]);
  // Starts true and flips to false after the first fetch settles. Existing
  // desktop consumers destructure only `{ data }` today, so adding
  // `loading` here is purely additive.
  const [loading, setLoading] = useState(true);
  const autoRefresh = mode === "live" || mode === "test";

  useEffect(() => {
    if (!autoRefresh) return;

    let cancelled = false;

    (async () => {
      const rows = await getSensors(mode);
      if (!cancelled) {
        setData(rows);
        setLoading(false);
      }
    })();

    const interval = setInterval(() => {
      getSensors(mode).then((rows) => {
        if (!cancelled) {
          setData(rows);
          setLoading(false);
        }
      });
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [mode, autoRefresh]);

  // History mode never goes through this hook's fetch path, so it should
  // never report "loading" either -- computed here instead of set via
  // state inside the effect, which avoids a synchronous setState call in
  // an early-return branch.
  return { data, autoRefresh, loading: autoRefresh ? loading : false };
}
