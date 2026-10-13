const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let devices = {};

app.post("/api/sensors", (req, res) => {

    const sensor = req.body;

    devices[sensor.id] = {
    id: sensor.id,
    name: "공학관 2층 화장실",
    temperature: sensor.temperature,
    humidity: sensor.humidity,
    airQuality: "좋음",
    status: "정상",
    lastSeen: new Date().toLocaleTimeString()
};

    res.json({
        success: true
    });

});

app.get("/api/sensors", (req, res) => {

    res.json(
        Object.values(devices)
    );

});

app.listen(3000, "0.0.0.0", () => {
    // Startup log kept intentionally -- this is a standalone CLI script,
    // not the main app, so a console line confirming it's listening is
    // expected/useful rather than debug noise.
    console.log("Server Running");
});
