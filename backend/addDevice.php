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

if ($id === "" || $name === "" || $location === "" || $status === "") {
    echo json_encode([
        "success" => false,
        "error" => "Device ID, name, location, and status are all required."
    ]);
    $conn->close();
    exit;
}

// Enforce a unique Device ID before inserting.
$check = $conn->prepare("SELECT id FROM devices WHERE id = ?");
$check->bind_param("s", $id);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode([
        "success" => false,
        "error" => "Device ID '$id' already exists."
    ]);
    $check->close();
    $conn->close();
    exit;
}

$check->close();

$stmt = $conn->prepare(
"INSERT INTO devices(id,NAME,location,STATUS)
VALUES(?,?,?,?)"
);

$stmt->bind_param(
"ssss",
$id,
$name,
$location,
$status
);

$stmt->execute();

echo json_encode([
    "success"=>true
]);

$stmt->close();
$conn->close();
