// Utilities for deriving building / floor / bathroom information from the
// existing `location` field returned by getSensors.php / getDevices.php.
//
// The devices table does not (yet) store building/floor/bathroom as
// separate columns, so this module parses them out of the free-text
// `location` string already provided by the API (e.g. "청조관 2층 화장실
// 203호"), and can also compose that same string back from the three
// parts. No backend or database schema changes are required for this to
// work, and it keeps working for any building/floor/room naming.

export function parseLocation(location) {
  const raw = (location ?? "").toString().trim();

  if (!raw) {
    return { building: "미지정", floor: null, room: null, label: "위치 미확인", raw: "" };
  }

  const buildingMatch = raw.match(/^(\S+)/);
  const building = buildingMatch ? buildingMatch[1] : "미지정";

  const floorMatch = raw.match(/(\d+)\s*층/);
  const floor = floorMatch ? floorMatch[1] : null;

  const roomMatch = raw.match(/(\d+)\s*호/);
  const room = roomMatch ? roomMatch[1] : null;

  const label = raw.slice(building.length).trim() || raw;

  return { building, floor, room, label, raw };
}

// Inverse of parseLocation(): builds the single `location` string the
// devices table actually stores, from separate Building / Floor / Bathroom
// form fields. Keeping this symmetric with parseLocation() means the
// Device Management form can expose granular fields without requiring any
// change to the devices table schema.
export function composeLocation({ building, floor, bathroom }) {
  const parts = [];

  if (building) parts.push(building.toString().trim());
  if (floor) parts.push(`${floor.toString().trim()}층`);
  parts.push("화장실");
  if (bathroom) parts.push(`${bathroom.toString().trim()}호`);

  return parts.join(" ");
}

// Groups an array of sensor rows by parsed building name, returning a
// summary per building: display name, number of monitored bathrooms, the
// worst status level found among its bathrooms, and how many of its
// bathrooms fall into each level. The per-level counts were already being
// gathered internally to compute the worst level -- this just exposes
// them too, instead of discarding them, so building-card UIs (the
// landscape/tablet dashboard) can show real green/yellow/red counts
// instead of a single collapsed status. `getLevel(row)` must return
// "normal" | "warning" | "danger" for a given row.
export function groupByBuilding(rows, getLevel) {
  const map = new Map();

  for (const row of rows) {
    const { building } = parseLocation(row.location);

    if (!map.has(building)) {
      map.set(building, { name: building, count: 0, levels: [] });
    }

    const entry = map.get(building);
    entry.count += 1;
    entry.levels.push(getLevel(row));
  }

  return Array.from(map.values())
    .map((entry) => ({
      name: entry.name,
      count: entry.count,
      status: worstLevel(entry.levels),
      normalCount: entry.levels.filter((l) => l === "normal").length,
      warningCount: entry.levels.filter((l) => l === "warning").length,
      dangerCount: entry.levels.filter((l) => l === "danger").length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

function worstLevel(levels) {
  if (levels.includes("danger")) return "danger";
  if (levels.includes("warning")) return "warning";
  return "normal";
}
