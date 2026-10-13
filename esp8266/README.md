# ESP8266 Sensor Nodes

No firmware source file (`.ino`/`.cpp`) is present in this repository
snapshot, so nothing has been added here beyond this description — the
goal is to document the role these devices play in the architecture
without inventing firmware code that isn't actually in the project.

## Role in the system

Each physical sensor node is an ESP8266 microcontroller wired to:

- a **DHT22** sensor (temperature + humidity), and
- an **MQ-135** sensor (air quality / gas).

On an interval, the node reads both sensors and sends a JSON payload over
HTTP POST to the backend's ingestion endpoint:

```
POST https://<your-backend-host>/upload.php
Content-Type: application/json

{
  "id": "D1-001",
  "temperature": 24.5,
  "humidity": 55.2,
  "airQuality": 42,
  "table": "live"
}
```

See `backend/upload.php` for exactly how this payload is consumed, and
`database/README.md` for the resulting table structure. `"table"` selects
whether the reading is written to the Live or Test table (`"live"` /
`"test"`).

## Device identity

The `id` field (e.g. `D1-001`) must match a row already registered in the
`devices` table (added via Device Management in the dashboard, or
directly in the database) — `backend/getSensors.php` joins on this ID to
attach a device's name, location, and administrative status to its latest
reading.

## Adding real firmware later

If/when firmware source is added to this repository, this folder is
where it belongs (e.g. `esp8266/cleanguard-node/cleanguard-node.ino`),
alongside a short note on the board package, libraries, and any
board-specific configuration (Wi-Fi credentials, upload URL, device ID)
required to flash it — ideally loaded from a separate, git-ignored config
header rather than hardcoded, for the same reason `backend/config.php`
no longer hardcodes database credentials.
