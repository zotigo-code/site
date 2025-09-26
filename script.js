// Shared State
const mainTable = document.getElementById("mainTable")?.getElementsByTagName("tbody")[0];
let adminPassword = localStorage.getItem("adminPassword") || "";
let loftData = JSON.parse(localStorage.getItem("loftData")) || Array(10).fill(null).map(() => Array(7).fill("")); // Load saved data or initialise empty
let uraanKaTime = parseTime(localStorage.getItem("uraanKaTime") || "00:00:00"); // Default to 00:00:00 if not set

// Admin Page Script
if (document.getElementById("loginSection")) {
  const loginSection = document.getElementById("loginSection");
  const formSection = document.getElementById("formSection");
  const loftSelect = document.getElementById("loftSelect");
  const pigeonNumberDropdown = document.getElementById("pigeonNumber");
  const uraanTimeInput = document.getElementById("uraanTime");
  const timeInput = document.getElementById("timeInput");

  // Populate Loft Dropdown
  loftSelect.innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">Loft ${i + 1}</option>`).join("");

  // Update Pigeon Number Dropdown when Loft is selected
  loftSelect.addEventListener("change", () => {
    updatePigeonNumberDropdown();
  });

  function updatePigeonNumberDropdown() {
    const loftIndex = loftSelect.value - 1;
    pigeonNumberDropdown.innerHTML = ""; // Clear existing options

    // Populate Pigeon Number Dropdown
    for (let i = 0; i < 7; i++) {
      const option = document.createElement("option");
      option.value = i + 1;
      option.textContent = `Pigeon ${i + 1}`;
      if (loftData[loftIndex][i] !== "") {
        // Mark already-filled slots but allow overwriting
        option.textContent += " (Filled)";
      }
      pigeonNumberDropdown.appendChild(option);
    }
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
    const pigeonIdx = pigeonNumberDropdown.value - 1; // Selected pigeon number (converted to 0-based index)

    // Validate time format (HH:MM:SS)
    if (!isValidTimeFormat(timeInput.value)) {
      alert("Invalid time format. Please use HH:MM:SS (24-hour format).");
      return;
    }

    // Save (or overwrite) the time in the correct slot
    loftData[loftIndex][pigeonIdx] = timeInput.value;
    saveLoftData();
    alert(`Time saved for Loft ${loftSelect.value}, Pigeon ${pigeonNumberDropdown.value}.`);
    updatePigeonNumberDropdown(); // Update the dropdown after saving
  });

  document.getElementById("applyUraanTimeBtn").addEventListener("click", () => {
    // Validate Uraan Ka Time format
    if (!isValidTimeFormat(uraanTimeInput.value)) {
      alert("Invalid Uraan Ka Time format. Please use HH:MM:SS.");
      return;
    }

    // Save Uraan Ka Time to localStorage
    uraanKaTime = parseTime(uraanTimeInput.value);
    localStorage.setItem("uraanKaTime", uraanTimeInput.value);

    // Update the main table to reflect the new Total column calculations
    updateMainTable();
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
      let totalSeconds = 0; // Total for the row

      for (let j = 1; j <= 7; j++) {
        const time = loftData[i][j - 1];
        row.cells[j].textContent = time || ""; // Populate the actual entered time

        // Calculate the difference (time - Uraan Ka Time) and add to total
        if (time) {
          const timeInSeconds = parseTime(time);
          const adjustedTime = Math.max(0, timeInSeconds - uraanKaTime); // Avoid negative values
          totalSeconds += adjustedTime;
        }
      }

      // Set the Total column value (sum of differences)
      row.cells[8].textContent = formatSeconds(totalSeconds);
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
  uraanKaTime = parseTime(localStorage.getItem("uraanKaTime") || "00:00:00"); // Load Uraan Ka Time
  updateMainTable();
}
