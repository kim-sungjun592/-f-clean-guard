<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

/*
    Live and History both read the latest reading from `sensor_data` --
    there is no separate history table. History mode gets its full
    historical detail from getHistory.php instead, so any table value
    other than "test" simply falls back to `sensor_data` here.

    live
    test
*/

$table = $_GET["table"] ?? "live";

switch($table){

    case "test":
        $sensorTable = "sensor_data_test";
        break;

    default:
        $sensorTable = "sensor_data";
        break;

}

$sql = "

SELECT
    d.id,
    d.NAME,
    d.location,
    d.STATUS,
    s.temperature,
    s.humidity,
    s.air_quality,
    s.created_at

FROM devices d

LEFT JOIN $sensorTable s

ON d.id = s.device_id

WHERE s.id = (

    SELECT MAX(id)

    FROM $sensorTable

    WHERE device_id = d.id

)

";

$result = $conn->query($sql);

$data = [];

while($row = $result->fetch_assoc()){

    $data[] = $row;

}

echo json_encode($data);

$conn->close();

?>
