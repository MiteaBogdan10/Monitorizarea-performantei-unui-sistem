const express = require('express');
const si = require('systeminformation');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const port = 3000;

// Servește fișierele statice
app.use(express.static(__dirname));

// Funcție pentru a obține temperatura CPU din Open Hardware Monitor
async function getCPUTemperature() {
    try {
        const response = await fetch("http://localhost:8085/data.json");
        const data = await response.json();

        let cpuTemps = [];
        function findTemperatures(children) {
            for (let category of children) {
                if (category.Text.includes("Temperatures")) {
                    for (let sensor of category.Children) {
                        if (sensor.Text.includes("CPU Core") || sensor.Text.includes("CPU Package")) {
                            let temp = parseFloat(sensor.Value.replace("°C", "").trim());
                            if (!isNaN(temp)) {
                                cpuTemps.push(temp);
                            }
                        }
                    }
                }
                if (category.Children) {
                    findTemperatures(category.Children);
                }
            }
        }

        findTemperatures(data.Children);
        if (cpuTemps.length > 0) {
            return (cpuTemps.reduce((a, b) => a + b, 0) / cpuTemps.length).toFixed(1) + " °C"; // Media temperaturilor
        } else {
            return "N/A";
        }
    } catch (error) {
        console.error("Error fetching CPU temperature from Open Hardware Monitor:", error);
        return "N/A";
    }
}

app.get('/api/systeminfo', async (req, res) => {
    try {
        const cpu = await si.cpu();
        const mem = await si.mem();
        const osInfo = await si.osInfo();
        const system = await si.system();
        const bios = await si.bios();
        const diskLayout = await si.diskLayout();
        const cpuTempSI = await si.cpuTemperature(); // Systeminformation
        const gpuTemp = await si.graphics();
        const disks = await si.fsSize();

        // Verifică temperatura CPU din Open Hardware Monitor
        let cpuTempOHM = await getCPUTemperature(); // Funcția care ia date din Open Hardware Monitor

        // Dacă systeminformation returnează 0, folosește Open Hardware Monitor
        let cpuTemp = cpuTempSI.main > 0 ? cpuTempSI.main : cpuTempOHM;

        // Calcul RAM Usage
        const ramUsage = ((mem.total - mem.available) / mem.total * 100).toFixed(2);

        // Calcul Disk Usage
        const totalDisk = disks.reduce((sum, disk) => sum + disk.size, 0) / 10 ** 9; // GB
        const usedDisk = disks.reduce((sum, disk) => sum + disk.used, 0) / 10 ** 9; // GB
        const diskUsage = ((usedDisk / totalDisk) * 100).toFixed(2);

        res.json({
            cpu,
            mem,
            osInfo,
            system,
            bios,
            diskLayout,
            cpuTemp,
            gpuTemp: gpuTemp.controllers.length > 0 ? gpuTemp.controllers[0].temperatureGpu : "N/A",
            ramUsage: `${ramUsage}%`,
            diskUsage: `${diskUsage}%`
        });
    } catch (e) {
        res.status(500).send(e.toString());
    }
});


// Servirea paginilor
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Serverul rulează la http://localhost:${port}`);
});

