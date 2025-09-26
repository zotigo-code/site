// Shared State
const mainTable = document.getElementById("mainTable")?.getElementsByTagName("tbody")[0];
let adminPassword = localStorage.getItem("adminPassword") || "";
let loftData = JSON.parse(localStorage.getItem("loftData")) || Array(10).fill(null).map(() => Array(7).fill("")); // Load from localStorage or initialise empty data

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

  // Update Pigeon Number when Loft is selected
  loftSelect.addEventListener("change", () => {
    updatePigeonNumber();
  });

  function updatePigeonNumber() {
    const loftIndex = loftSelect.value - 1;
    const nextEmpty = loftData[loftIndex].findIndex(value => value === ""); // Find the first empty slot
    pigeonNumber.value = nextEmpty >= 0 ? nextEmpty + 1 : "Full"; // Show next slot or "Full"
  }

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
    const loftIndex = loftSelect.value - 1; // Selected loft index
    const pigeonIdx = pigeonNumber.value - 1; // Selected pigeon number (converted to 0-based index)

    // Validate input
    if (pigeonIdx < 0 || pigeonIdx >= 7 || loftData[loftIndex][pigeonIdx] !== "") {
      alert("Unable to save. All slots are full or invalid input.");
      return;
    }

    // Validate time format (HH:MM:SS)
    if (!isValidTimeFormat(timeInput.value)) {
      alert("Invalid time format. Please use HH:MM:SS (24-hour format).");
      return;
    }

    // Save the time in the correct slot
    loftData[loftIndex][pigeonIdx] = timeInput.value;
    saveLoftData();
    alert(`Time saved for Loft ${loftSelect.value}, Pigeon ${pigeonNumber.value}.`);
    updatePigeonNumber(); // Update the next empty slot after saving
  });

  document.getElementById("applyUraanTimeBtn").addEventListener("click", () => {
    const uraanTime = parseTime(uraanTimeInput.value);

    // Validate time format
    if (!uraanTimeInput.value || isNaN(uraanTime)) {
      alert("Invalid Uraan Ka Time format. Please use HH:MM:SS.");
      return;
    }

    // Apply "Uraan Ka Time" to all rows
    loftData = loftData.map(row =>
      row.map(time => time ? subtractTime(parseTime(time), uraanTime) : time)
    );
    saveLoftData();
    alert("Uraan Ka Time applied to all rows.");
  });

  function isValidTimeFormat(timeStr) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/; // Matches HH:MM:SS in 24-hour format
    return timeRegex.test(timeStr);
  }

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

  // Save loft data to localStorage
  function saveLoftData() {
    localStorage.setItem("loftData", JSON.stringify(loftData));
    updateMainTable(); // Ensure the main table is updated in real time
  }
}

// Main Table Update
function updateMainTable() {
  if (mainTable) {
    Array.from(mainTable.rows).forEach((row, i) => {
      let totalSeconds = 0;
      for (let j = 1; j <= 7; j++) {
        const time = loftData[i][j - 1];
        row.cells[j].textContent = time || "";
        if (time) totalSeconds += parseTime(time);
      }
      row.cells[8].textContent = totalSeconds ? formatSeconds(totalSeconds) : "";
    });
  }
}

function parseTime(timeStr) {
  const [hh, mm, ss] = timeStr.split(":").map(Number);
  return hh * 3600 + mm * 60 + ss;
}

function formatSeconds(seconds) {
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds % 3600) / 60);
  const ss = seconds % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

// Restore saved data from localStorage (if available)
if (mainTable && localStorage.getItem("loftData")) {
  loftData = JSON.parse(localStorage.getItem("loftData"));
  updateMainTable();
}
