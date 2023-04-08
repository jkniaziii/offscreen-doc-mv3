const stopButton = document.createElement("button");
let counter = 0;

function updateCounter() {
    counter++;
    stopButton.innerHTML = `<button class="stop-recording"><span>Stop ${counter}</span></button>`;
}

function injectContent(recording) {
  recording ? document.body.appendChild(stopButton) : stopButton.remove();
}

stopButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "stop" });
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg.type) {
    case "inject-content":
      injectContent(true);
      setInterval(updateCounter, 1000); // increment counter every second
      break;
    case "remove-content":
      injectContent(false);
      break;
  }
});
