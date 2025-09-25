function isValidTimeFormat(time) {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  return timeRegex.test(time);
}

// Example usage for save button
saveButton.addEventListener('click', () => {
  const timeValue = timeInput.value;
  if (!isValidTimeFormat(timeValue)) {
    alert('Please enter a valid time in HH:MM:SS format (24-hour).');
    return;
  }
  // Save data if valid
});

// Example usage for Uraan Time
applyUraanButton.addEventListener('click', () => {
  const uraanTimeValue = uraanTimeInput.value;
  if (!isValidTimeFormat(uraanTimeValue)) {
    alert('Please enter a valid Uraan time in HH:MM:SS format (24-hour).');
    return;
  }
  // Apply Uraan time if valid
});
