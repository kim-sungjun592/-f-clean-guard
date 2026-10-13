<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "config.php";

/*
    History mode's raw log endpoint.

    Unlike getSensors.php (latest reading per device) this deliberately
    returns every individual measurement from `sensor_data`, newest first,
    paginated -- History is a browsing/analysis log, not a live monitor,
    so it must never be collapsed down to one row per device.
*/

$page = max(1, intval($_GET["page"] ?? 1));
$pageSize = intval($_GET["pageSize"] ?? 50);

if ($pageSize < 1) {
    $pageSize = 50;
}
if ($pageSize > 200) {
    $pageSize = 200;
}

$offset = ($page - 1) * $pageSize;

$total = 0;
$countResult = $conn->query("SELECT COUNT(*) AS total FROM sensor_data");
if ($countResult) {
    $countRow = $countResult->fetch_assoc();
    $total = intval($countRow["total"] ?? 0);
}

$sql = "
SELECT
    s.id AS reading_id,
    d.id AS id,
    d.NAME,
    d.location,
    d.STATUS,
    s.temperature,
    s.humidity,
    s.air_quality,
    s.created_at
FROM sensor_data s
LEFT JOIN devices d ON d.id = s.device_id
ORDER BY s.created_at DESC, s.id DESC
LIMIT ? OFFSET ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $pageSize, $offset);
$stmt->execute();

$result = $stmt->get_result();

$records = [];

while ($row = $result->fetch_assoc()) {
    $records[] = $row;
}

echo json_encode([
    "records" => $records,
    "page" => $page,
    "pageSize" => $pageSize,
    "total" => $total,
    "totalPages" => $pageSize > 0 ? intval(ceil($total / $pageSize)) : 0,
]);

$stmt->close();
$conn->close();

?>
