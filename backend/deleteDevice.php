<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = trim($data["id"] ?? "");

if ($id === "") {
    echo json_encode([
        "success" => false,
        "error" => "Device ID is required."
    ]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare(
"DELETE FROM devices
WHERE id=?"
);

$stmt->bind_param(
"s",
$id
);

$stmt->execute();

echo json_encode([
    "success" => true,
    "deleted" => $stmt->affected_rows > 0
]);

$stmt->close();
$conn->close();
