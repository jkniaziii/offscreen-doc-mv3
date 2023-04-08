var recording;


const createOffScreen = async function(){
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: "../html/offscreen.html",
    reasons: ["CLIPBOARD"],
    justification: "inject-contenting",
  });
}

createOffScreen();
chrome.tabs.onActivated.addListener(function(activeInfo) {
  myFunction(activeInfo.tabId);
  injuctScript(activeInfo.tabId);
});


chrome.tabs.onCreated.addListener(function(tab) {
    injuctScript(tab.id);
});

function myFunction(tabId) {
  console.log("Tab with ID " + tabId + " activated");
}

self.addEventListener('fetch', function(event) {
});

function injuctScript(id){
    chrome.tabs.sendMessage(id, {type: recording ? 'inject-content': 'remove-content'});
}

chrome.runtime.onMessage.addListener(async (msg) => {
  switch (msg.type) {
    case "start":
        chrome.runtime.sendMessage({ type: "start", offscreen: true});
      break;
    case "stop":
        chrome.runtime.sendMessage({ type: "stop", offscreen: true});
    case "inject-content":
      recording = msg.recording;
      chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
      return injuctScript(tabs[0].id);
    });
  }
});
