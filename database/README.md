# Database

No `.sql` migration/dump files exist in this project's history, so this
document describes the tables `backend/*.php` expects, inferred directly
from the columns each query actually reads and writes. Use it as a
reference schema to stand up a compatible MySQL/MariaDB database — it is
not an exported dump of any specific server.

## `devices`

The device registry (Device Management CRUD). One row per physical sensor
node.

| Column     | Type (suggested)         | Notes                                             |
|------------|---------------------------|----------------------------------------------------|
| `id`       | `VARCHAR(50)` PRIMARY KEY | Device ID, e.g. `D1-001`. Set once, never updated. |
| `NAME`     | `VARCHAR(100)`             | Display name, e.g. `D1 Mini 2`.                    |
| `location` | `VARCHAR(150)`             | Free text: `"<건물> <층>층 화장실 <호>호"`. Parsed by `frontend/src/utils/location.js`. |
| `STATUS`   | `VARCHAR(20)`               | One of `정상` / `점검중` / `고장` (see `frontend/src/constants.js`). |

```sql
CREATE TABLE devices (
    id       VARCHAR(50)  NOT NULL PRIMARY KEY,
    NAME     VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    STATUS   VARCHAR(20)  NOT NULL DEFAULT '정상'
);
```

## `sensor_data` and `sensor_data_test`

Raw sensor readings. Identical structure; `sensor_data` is the Live table,
`sensor_data_test` is the Test table (selected by `?table=` on the read
endpoints, or `"table"` in `upload.php`'s request body). History mode
always reads from `sensor_data` — there is no separate history table.

| Column        | Type (suggested)     | Notes                                                     |
|---------------|------------------------|-------------------------------------------------------------|
| `id`          | `INT` PRIMARY KEY AUTO_INCREMENT | Reading ID.                                       |
| `device_id`   | `VARCHAR(50)`           | Foreign key to `devices.id`.                                |
| `temperature` | `DECIMAL(5,2)` / `FLOAT` | Degrees Celsius.                                             |
| `humidity`    | `DECIMAL(5,2)` / `FLOAT` | Relative humidity, percent.                                  |
| `air_quality` | `VARCHAR(20)` or numeric | `frontend/src/utils/status.js` compares this against the string `"나쁨"`; `backend/getHistory.php` also runs `AVG()` on it for the trend chart — confirm which convention your sensor firmware sends before choosing a type. |
| `created_at`  | `DATETIME` / `TIMESTAMP` | Not supplied by `upload.php`'s INSERT — should default to `CURRENT_TIMESTAMP`. |

```sql
CREATE TABLE sensor_data (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    device_id   VARCHAR(50)  NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    humidity    DECIMAL(5,2) NOT NULL,
    air_quality VARCHAR(20)  NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (device_id),
    INDEX (created_at)
);

CREATE TABLE sensor_data_test LIKE sensor_data;
```

> `backend/upload.php` also accepts a `"table": "history"` value that maps
> to `sensor_data_history` — that table does not exist in the schema
> above. This is a pre-existing inconsistency in the endpoint, left
> unmodified per this cleanup's "do not change functionality" scope; see
> `backend/README.md`.

## `restroom_sencor_fake_data`

Written by the separate Raspberry Pi AI process, read-only from PHP's
perspective (`backend/getAIStatus.php`). Not currently called by the
frontend — the AI panel is a placeholder pending the live demo's AI
server. Columns, as read by `getAIStatus.php`:

| Column                          | Notes                                   |
|----------------------------------|------------------------------------------|
| `device_id`                      | Foreign key to `devices.id`.              |
| `temperature`, `humidity`, `mq135_raw` | Sensor snapshot the prediction was made from. |
| `window_open_predicted`, `window_open_probability` | Window-open prediction + confidence. |
| `faucet_on_predicted`, `faucet_on_probability`       | Faucet-on prediction + confidence.   |
| `leak_active_predicted`, `leak_active_probability`   | Leak prediction + confidence.        |
| `freeze_risk_1h_predicted`, `freeze_risk_1h_probability` | 1-hour freeze risk prediction + confidence. |
| `freeze_risk_3h_predicted`, `freeze_risk_3h_probability` | 3-hour freeze risk prediction + confidence. |
| `created_at`                     | Timestamp of the prediction.              |

This table's exact types weren't inferrable from the PHP alone (it's only
ever read, never created, by this codebase) — coordinate its schema with
whoever owns the Raspberry Pi AI process.

## Setting up credentials

None of the above requires committing real credentials. Copy
`backend/config.local.example.php` to `backend/config.local.php` (git
ignored) and fill in your real host/database/user/password, or set the
`DB_HOST` / `DB_NAME` / `DB_USER` / `DB_PASSWORD` environment variables.
See `.env.example` and `backend/README.md`.
