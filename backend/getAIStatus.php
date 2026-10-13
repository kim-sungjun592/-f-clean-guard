<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "config.php";

/*
    Reads the latest AI prediction for a device from `restroom_sencor_fake_data`
    -- the table the Raspberry Pi AI model already writes its prediction
    results into. This endpoint only ever reads from it; it never writes,
    never creates another table, and never invents a value that isn't
    already a real column in this table.

    Modes:
      - getAIStatus.php?device_id=D1-001
            Latest prediction row for that device (Live/Test mode -- the
            AI panel should always show the newest prediction available).

      - getAIStatus.php?device_id=D1-001&at=2026-07-13 15:30:00
            The prediction row whose created_at is closest to `at`
            (History mode, matched to the specific historical sensor
            reading the user tapped/clicked). If nothing is within a
            5-minute tolerance -- the same bucket size getHistory.php
            already uses -- no row is returned rather than attaching a
            mismatched prediction to that record.
*/

$deviceId = $_GET["device_id"] ?? null;
$at = $_GET["at"] ?? null;

if (!$deviceId) {
    echo json_encode(["available" => false, "error" => "device_id is required"]);
    exit;
}

$columns = "
    device_id,
    temperature,
    humidity,
    mq135_raw,
    window_open_predicted,
    window_open_probability,
    faucet_on_predicted,
    faucet_on_probability,
    leak_active_predicted,
    leak_active_probability,
    freeze_risk_1h_predicted,
    freeze_risk_1h_probability,
    freeze_risk_3h_predicted,
    freeze_risk_3h_probability,
    created_at
";

$TOLERANCE_SECONDS = 300;

if ($at) {
    $sql = "
        SELECT $columns
        FROM restroom_sencor_fake_data
        WHERE device_id = ?
          AND ABS(TIMESTAMPDIFF(SECOND, created_at, ?)) <= $TOLERANCE_SECONDS
        ORDER BY ABS(TIMESTAMPDIFF(SECOND, created_at, ?)) ASC
        LIMIT 1
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $deviceId, $at, $at);
} else {
    $sql = "
        SELECT $columns
        FROM restroom_sencor_fake_data
        WHERE device_id = ?
        ORDER BY created_at DESC
        LIMIT 1
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $deviceId);
}

$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode(["available" => false]);
} else {
    $row["available"] = true;
    echo json_encode($row);
}

$stmt->close();
$conn->close();

?>
