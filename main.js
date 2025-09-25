let tableData = [
    { loft: 'Loft 1', times: [0, 0, 0, 0, 0, 0, 0], total: 0, uraanKaTime: null },
    { loft: 'Loft 2', times: [0, 0, 0, 0, 0, 0, 0], total: 0, uraanKaTime: null },
];

let lastUpdatedCell = null; // To track the last updated cell

function updateTable() {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; // Clear the table body
    let totalPigeons = tableData.length * 7;
    let nonZeroCells = 0;
    let uraanTimes = tableData.map(row => row.uraanKaTime);
    const allSameUraan = uraanTimes.every((val, _, arr) => val === arr[0] && val !== null);

    for (const [rowIndex, row] of tableData.entries()) {
        const tr = document.createElement("tr");
        const tdLoft = document.createElement("td");
        tdLoft.textContent = row.loft;
        tr.appendChild(tdLoft);

        let rowTotal = 0;
        row.times.forEach((time, colIndex) => {
            const tdTime = document.createElement("td");
            tdTime.textContent = time || 0;
            if (time > 0) nonZeroCells++;
            rowTotal += time;

            // Highlight the last updated cell
            if (lastUpdatedCell && lastUpdatedCell.row === rowIndex && lastUpdatedCell.col === colIndex) {
                tdTime.classList.add("blinking");
            }

            tr.appendChild(tdTime);
        });

        const tdTotal = document.createElement("td");
        tdTotal.textContent = rowTotal;
        row.total = rowTotal;
        tr.appendChild(tdTotal);

        tableBody.appendChild(tr);
    }

    document.getElementById("totalPigeons").textContent = totalPigeons;
    document.getElementById("nonZeroCells").textContent = nonZeroCells;

    const uraanHeader = document.getElementById("uraanKaTimeHeader");
    if (allSameUraan) {
        uraanHeader.textContent = `Uraan Ka Time: ${uraanTimes[0] || "N/A"}`;
    } else {
        uraanHeader.textContent = ""; // Reset header
    }

    updateLastUpdated();
}

function updateLastUpdated() {
    const lastUpdatedElement = document.getElementById("lastUpdated");
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    lastUpdatedElement.textContent = formattedDate;
}

// Simulate a data update
setTimeout(() => {
    tableData[0].times[2] = "12:34:56"; // Update Loft 1, Time 3
    lastUpdatedCell = { row: 0, col: 2 };
    updateTable();
}, 3000);

updateTable();