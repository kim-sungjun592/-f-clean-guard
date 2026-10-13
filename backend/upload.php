<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$device_id = $data["id"];
$temp = $data["temperature"];
$humidity = $data["humidity"];
$air = $data["airQuality"] ?? 0;

// Live por defecto
$table = $data["table"] ?? "live";

switch($table){

    case "test":
        $sensorTable = "sensor_data_test";
        break;

    case "history":
        $sensorTable = "sensor_data_history";
        break;

    default:
        $sensorTable = "sensor_data";
        break;
}

$sql = "INSERT INTO $sensorTable
(device_id, temperature, humidity, air_quality)
VALUES
('$device_id','$temp','$humidity','$air')";

$conn->query($sql);

echo json_encode([
    "success" => true
]);

$conn->close();

?>