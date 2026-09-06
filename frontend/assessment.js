// =========================================================
// ASSESSMENT PAGE - BASIC FRONTEND INTERACTION
// =========================================================

// Find the "Start Assessment" button from HTML
const startButton = document.getElementById("startAssessmentBtn");

// Find the message container
const assessmentMessage = document.getElementById("assessmentMessage");


// Run this function when the button is clicked
startButton.addEventListener("click", function () {

    // Show the hidden message
    assessmentMessage.style.display = "block";

});