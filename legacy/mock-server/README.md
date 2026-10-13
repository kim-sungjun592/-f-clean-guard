# Legacy Mock Server (not part of the current architecture)

This is an early Express.js prototype (`server.js`) that mocked a simple
`/api/sensors` endpoint in memory. It predates the project's current
backend and is **not used by the app anymore**.

CleanGuard's real data path today is:

```
ESP8266 sensor nodes -> backend/ (PHP + MySQL) -> React frontend
```

See `backend/README.md` for the actual API the frontend talks to.

This folder is kept only for historical reference (per the project's
policy of not deleting existing source code during the GitHub cleanup).
It is safe to ignore, and is not wired into `frontend/` or `backend/` in
any way. If you don't need the history, this whole folder can be deleted.

To run it anyway (for reference only):

```bash
cd legacy/mock-server
npm install
node server.js   # listens on http://localhost:3000
```
