document.addEventListener("DOMContentLoaded", function () {
  const num1 = document.getElementById("number1");
  const num2 = document.getElementById("number2");
  const resultBox = document.getElementById("result");
  const addButton = document.querySelector(".add");
  const subButton = document.querySelector(".sub");
  const timeDisplay = document.getElementById("current-time");
  const dateDisplay = document.getElementById("current-date");

  function updateDateTime() {
    const now = new Date();
    dateDisplay.textContent = now.toLocaleDateString("en-GB");
    timeDisplay.textContent = now.toLocaleTimeString(); 
  }

  setInterval(updateDateTime, 500); 
  updateDateTime(); 

  addButton.addEventListener("click", function () {
    const val1 = parseFloat(num1.value);
    const val2 = parseFloat(num2.value);
    if (!isNaN(val1) && !isNaN(val2)) {
      resultBox.textContent = val1 + val2;
    } else {
      resultBox.textContent = "Invalid Input";
    }
  });

  subButton.addEventListener("click", function () {
    const val1 = parseFloat(num1.value);
    const val2 = parseFloat(num2.value);
    if (!isNaN(val1) && !isNaN(val2)) {
      resultBox.textContent = val1 - val2;
    } else {
      resultBox.textContent = "Invalid Input";
    }
  });
});
