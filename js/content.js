const stopButton = document.createElement("button");


function updateCounter(counter) {
  console.log({ counter })
  stopButton.innerHTML = `<button class="stop-recording"><span>Stop ${counter}</span></button>`;
}

function injectContent(recording) {
  console.log({ recording })
  recording ? document.body.appendChild(stopButton) : stopButton.remove();
}

stopButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "stop" });
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("msg.type :", msg.type);
  switch (msg.type) {
    case "inject-content":
      return injectContent(true);
    case "timer-tick":
      return updateCounter(msg.time);
    case "remove-content":
      return injectContent(false);
  }
});
