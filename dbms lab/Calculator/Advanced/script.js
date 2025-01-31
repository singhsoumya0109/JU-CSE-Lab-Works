document.addEventListener("DOMContentLoaded", function () {
  const display = document.getElementById("display");
  const numButtons = document.querySelectorAll(".num");
  const opButtons = document.querySelectorAll(".op");
  const equalButton = document.querySelector(".equal");
  const clearButton = document.querySelector(".clear");
  const timeDisplay = document.getElementById("current-time");
  const dateDisplay = document.getElementById("current-date");

  function updateDateTime() {
    const now = new Date();
    dateDisplay.textContent = now.toLocaleDateString("en-GB");
    timeDisplay.textContent = now.toLocaleTimeString();
  }

  setInterval(updateDateTime, 500);
  updateDateTime();

  numButtons.forEach((button) => {
    button.addEventListener("click", () => {
      display.value += button.getAttribute("data-value");
    });
  });

  opButtons.forEach((button) => {
    button.addEventListener("click", () => {
      display.value += ` ${button.getAttribute("data-value")} `;
    });
  });

  equalButton.addEventListener("click", () => {
    try {
      display.value = eval(display.value);
    } catch {
      display.value = "Error";
    }
  });

  clearButton.addEventListener("click", () => {
    display.value = "";
  });
});
