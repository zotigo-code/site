// Shared State
const mainTable = document.getElementById("mainTable")?.getElementsByTagName("tbody")[0];
let adminPassword = localStorage.getItem("adminPassword") || "";
let loftData = Array(10).fill(null).map(() => Array(7).fill(""));

// Admin Page Script
if (document.getElementById("loginSection")) {
  const loginSection = document.getElementById("loginSection");
  const formSection = document.getElementById("formSection");
  const loftSelect = document.getElementById("loftSelect");
  const pigeonNumber = document.getElementById("pigeonNumber");
  const uraanTimeInput = document.getElementById("uraanTime");
  const timeInput = document.getElementById("timeInput");

  // Populate Loft Dropdown
  loftSelect.innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Loft ${i + 1}</option>`).join("");

  loftSelect.addEventListener("change", () => {
    const loftIndex = loftSelect.value - 1;
    const nextEmpty = loftData[loftIndex].findIndex(value => value === "") + 1;
    pigeonNumber.value = nextEmpty || "Full";
  });

  document.getElementById("setPasswordBtn").addEventListener("click", () => {
    adminPassword = document.getElementById("adminPassword").value;
    localStorage.setItem("adminPassword", adminPassword);
    alert("Password set!");
  });

  document.getElementById("loginBtn").addEventListener("click", () => {
    if (document.getElementById("adminPassword").value === adminPassword) {
      loginSection.style.display = "none";
      formSection.style.display = "block";
    } else {
      alert("Incorrect password!");
    }
  });

  document.getElementById("saveBtn").addEventListener("click", () => {
    const loftIndex = loftSelect.value - 1;
    const pigeonIdx = pigeonNumber.value - 1;
    if (pigeonIdx >= 0 && pigeonIdx < 7) {
      loftData[loftIndex][pigeonIdx] = timeInput.value;
      updateMainTable();
    }
  });

  document.getElementById("applyUraanTimeBtn").addEventListener("click", () => {
    const uraanTime = parseTime(uraanTimeInput.value);
    loftData = loftData.map(row =>
      row.map(time => time ? subtractTime(parseTime(time), uraanTime) : time)
    );
    updateMainTable();
  });

  function parseTime(timeStr) {
    const [hh, mm, ss] = timeStr.split(":").map(Number);
    return hh * 3600 + mm * 60 + ss;
  }

  function subtractTime(time, subTime) {
    const total = time - subTime;
    const hh = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const ss = total % 60;
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }
}

// Main Table Update
function updateMainTable() {
  if (mainTable) {
    Array.from(mainTable.rows).forEach((row, i) => {
      for (let j = 1; j <= 7; j++) {
        row.cells[j].textContent = loftData[i][j - 1] || "";
      }
      row.cells[8].textContent = loftData[i].reduce((sum, time) => sum + (time ? parseTime(time) : 0), 0);
    });
  }
}
