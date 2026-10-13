<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "config.php";

// History mode has no dedicated table -- every sensor reading already
// lives in `sensor_data`, so this endpoint reads directly from it and
// groups readings into 5-minute buckets for a given device.
$device = $_GET["device_id"] ?? "";

if ($device === "") {
    echo json_encode([]);
    exit;
}

$sql = "
SELECT
    MIN(created_at) AS created_at,
    AVG(temperature) AS temperature,
    AVG(humidity) AS humidity,
    AVG(air_quality) AS air_quality
FROM sensor_data
WHERE device_id = ?
GROUP BY FLOOR(UNIX_TIMESTAMP(created_at) / 300)
ORDER BY created_at ASC
";

$stmt = $conn->prepare($sql);
// device_id is a string identifier (e.g. "D1-001"), not an integer.
$stmt->bind_param("s", $device);
$stmt->execute();

$result = $stmt->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();
$conn->close();

?>
