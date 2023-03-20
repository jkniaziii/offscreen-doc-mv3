document.querySelector(".start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "start" });
});

document.querySelector(".stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "stop" });
});