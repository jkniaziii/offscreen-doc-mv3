const startButton = document.querySelector(".start");
const stopButton = document.querySelector(".stop");


startButton.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "start" });
});

// stopButton.addEventListener("click", () => {
//   chrome.runtime.sendMessage({ type: "stop" });
// });