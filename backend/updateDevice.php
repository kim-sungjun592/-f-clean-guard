<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = trim($data["id"] ?? "");
$name = trim($data["NAME"] ?? "");
$location = trim($data["location"] ?? "");
$status = trim($data["STATUS"] ?? "");

// Device ID is intentionally read-only from the client -- it is only ever
// used here to locate the row to update, never to change it.
if ($id === "" || $name === "" || $location === "" || $status === "") {
    echo json_encode([
        "success" => false,
        "error" => "Name, location, and status are all required."
    ]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare(
"UPDATE devices
SET NAME=?,
location=?,
STATUS=?
WHERE id=?"
);

$stmt->bind_param(
"ssss",
$name,
$location,
$status,
$id
);

$stmt->execute();

echo json_encode([
    "success"=>true
]);

$stmt->close();
$conn->close();
