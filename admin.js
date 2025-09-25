function editHeading() {
    const headingDisplay = document.getElementById("pageHeading");
    const headingEdit = document.getElementById("editableHeading");
    const headingInput = document.getElementById("headingInput");

    headingInput.value = headingDisplay.textContent;
    headingDisplay.style.display = "none";
    headingEdit.style.display = "block";
}

function saveHeading() {
    const headingDisplay = document.getElementById("pageHeading");
    const headingEdit = document.getElementById("editableHeading");
    const headingInput = document.getElementById("headingInput");

    headingDisplay.textContent = headingInput.value || "Set the page heading";
    headingDisplay.style.display = "block";
    headingEdit.style.display = "none";
}