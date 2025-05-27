function updateHardwareInfo() {
    axios.get('/api/systeminfo')
        .then(response => {
            const data = response.data;

            // Extragem datele reale din API
            const cpuTempValue = parseFloat(data.cpuTemp) || 0;
            const gpuTempValue = parseFloat(data.gpuTemp) || 0;
            const ramUsageValue = parseFloat(data.ramUsage) || 0;
            const diskUsageValue = parseFloat(data.diskUsage) || 0;

            const timeLabel = new Date().toLocaleTimeString();

            // Adaugă date noi la graficul pentru temperatura CPU-ului
            cpuTempChart.data.labels.push(timeLabel);
            cpuTempChart.data.datasets[0].data.push(cpuTempValue);
            cpuTempChart.update();

            // Adaugă date noi la graficul pentru temperatura GPU-ului
            gpuTempChart.data.labels.push(timeLabel);
            gpuTempChart.data.datasets[0].data.push(gpuTempValue);
            gpuTempChart.update();

            // Adaugă date noi la graficul pentru utilizarea RAM-ului
            ramUsageChart.data.labels.push(timeLabel);
            ramUsageChart.data.datasets[0].data.push(ramUsageValue);
            ramUsageChart.update();

            // Adaugă date noi la graficul pentru utilizarea SSD-ului
                diskUsageChart.data.labels.push(timeLabel);
                diskUsageChart.data.datasets[0].data.push(diskUsageValue);
                diskUsageChart.update();


                // Actualizează tabelul hardware
            document.getElementById('cpu-temp-value').innerText = `${cpuTempValue} °C`;
            document.getElementById('gpu-temp-value').innerText = `${gpuTempValue} °C`;
            document.getElementById('ram-usage-value').innerText = `${ramUsageValue} %`;
            document.getElementById('disk-usage-value').innerText = `${diskUsageValue} %`;
        })
        .catch(error => {
            console.error('Error fetching hardware info:', error);
        });
}

// Actualizează informațiile hardware la fiecare 3 secunde
setInterval(updateHardwareInfo, 3000);

