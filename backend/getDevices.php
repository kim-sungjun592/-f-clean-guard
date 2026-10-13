<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "config.php";

$sql = "SELECT * FROM devices ORDER BY id";

$result = $conn->query($sql);

$devices = [];

while($row = $result->fetch_assoc()){
    $devices[] = $row;
}

echo json_encode($devices);

$conn->close();