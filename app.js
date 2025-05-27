document.addEventListener('DOMContentLoaded', () => {
    const cpuInfo = document.getElementById('cpu-info');
    const memoryInfo = document.getElementById('memory-info');
    const osInfo = document.getElementById('os-info');
    const systemInfo = document.getElementById('system-info');
    const biosInfo = document.getElementById('bios-info');
    const diskInfo = document.getElementById('disk-info');

    axios.get('/api/systeminfo')
        .then(response => {
            const data = response.data;

            // Afișează informațiile despre CPU
            cpuInfo.innerHTML = `
                <h2>Informatii CPU</h2>
                <table>
                    <tr><th>Model</th><th>Speed (GHz)</th><th>Cores</th></tr>
                    <tr><td>${data.cpu.manufacturer} ${data.cpu.brand}</td><td>${data.cpu.speed}</td><td>${data.cpu.cores}</td></tr>
                </table>
            `;

            // Afișează informațiile despre Memorie
            memoryInfo.innerHTML = `
                <h2>Informatii Memorie</h2>
                <table>
                    <tr><th>Total (GB)</th><th>Available (GB)</th></tr>
                    <tr><td>${data.mem.total.toFixed(2)/(10**9)}</td><td>${data.mem.available.toFixed(2)/(10**9)}</td></tr>
                </table>
            `;

            // Afișează informațiile despre Sistem de Operare
            osInfo.innerHTML = `
                <h2>Informatii Sistem de Operare</h2>
                <table>
                    <tr><th>Platform</th><th>Distribution</th><th>Release</th></tr>
                    <tr><td>${data.osInfo.platform}</td><td>${data.osInfo.distro}</td><td>${data.osInfo.release}</td></tr>
                </table>
            `;

            // Afișează informațiile despre Sistem
            systemInfo.innerHTML = `
                <h2>Informatii Sistem</h2>
                <table>
                    <tr><th>Manufacturer</th><th>Model</th><th>Serial</th></tr>
                    <tr><td>${data.system.manufacturer}</td><td>${data.system.model}</td><td>${data.system.serial}</td></tr>
                </table>
            `;

            // Afișează informațiile despre BIOS
            biosInfo.innerHTML = `
                <h2>Informatii BIOS</h2>
                <table>
                    <tr><th>Manufacturer</th><th>Version</th><th>Release Date</th></tr>
                    <tr><td>${data.bios.vendor}</td><td>${data.bios.version}</td><td>${data.bios.releaseDate}</td></tr>
                </table>
            `;

            // Afișează informațiile despre Discuri
            diskInfo.innerHTML = `
                <h2>Informații despre disc</h2>
                <table>
                    <tr><th>Drive</th><th>Model</th><th>Type</th><th>Size (GB)</th></tr>
                    ${data.diskLayout.map((disk, index) => `
                        <tr><td>${index + 1}</td><td>${disk.name}</td><td>${disk.type}</td><td>${disk.size.toFixed(2)/(10**9)}</td></tr>
                    `).join('')}
                </table>
            `;
        })
        .catch(error => {
            console.error('Error fetching system info:', error);
        });
});
