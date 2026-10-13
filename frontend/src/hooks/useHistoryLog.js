import { useCallback, useEffect, useState } from "react";
import { getSensorLog } from "../services/api";

const PAGE_SIZE = 50;

// Drives History mode's log: every individual measurement from
// `sensor_data`, newest first, loaded page by page (see getSensorLog.php).
// There is no interval anywhere in this hook -- History never
// auto-refreshes, it is a browsing/analysis view, not a live monitor.
//
// This hook is meant to be used from a component that is only mounted
// while History mode is active (see components/HistoryPanel.jsx), so it
// always starts fresh (page 1, empty accumulator) whenever History mode
// is entered, and its state is simply discarded when the user switches
// away -- no manual "reset" call needed.
export function useHistoryLog() {
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load the first page on mount.
  useEffect(() => {
    let cancelled = false;

    getSensorLog({ page: 1, pageSize: PAGE_SIZE }).then((result) => {
      if (cancelled) return;
      setRecords(result.records);
      setTotal(result.total);
      setPage(result.page);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(() => {
    setLoading(true);
    const nextPage = page + 1;

    getSensorLog({ page: nextPage, pageSize: PAGE_SIZE }).then((result) => {
      setRecords((prev) => [...prev, ...result.records]);
      setTotal(result.total);
      setPage(result.page);
      setLoading(false);
    });
  }, [page]);

  const hasMore = records.length < total;

  return { records, total, loading, hasMore, loadMore };
}
