(async () => {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "testing",
  });
  
})();



chrome.runtime.onMessage.addListener(async (msg) => {
  switch (msg.type) {
    case "start":
      chrome.storage.local.get(["key"]).then((result) => {
        chrome.runtime.sendMessage({ type: "start", offscreen: true, storage: result.key });
      });Popup
      break;
    case "stop":
      chrome.storage.local.get(["key"]).then((result) => {
        chrome.runtime.sendMessage({ type: "stop", offscreen: true, storage: result.key });
      });
      break;
  }
});
