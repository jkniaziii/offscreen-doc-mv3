var recording;
let stopwatchInterval;
let time = '';

const createOffScreen = async function () {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: "../html/offscreen.html",
    reasons: ["CLIPBOARD"],
    justification: "inject-contenting",
  });
}

createOffScreen();

function scriptHandler(id) {
    chrome.tabs.sendMessage(id, { type: recording ? 'inject-content' : 'remove-content' });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  myFunction(activeInfo.tabId);
  scriptHandler(activeInfo.tabId);
});


chrome.tabs.onCreated.addListener(function (tab) {
  scriptHandler(tab.id);
});

function myFunction(tabId) {
  console.log("Tab with ID " + tabId + " activated");
}

self.addEventListener('fetch', function (event) {
});

function formatStopwatchMilliseconds(millisec) {
  let seconds = (millisec / 1000).toFixed(0);
  let minutes = Math.floor(seconds / 60);
  let hours = "";
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    hours = (hours >= 10) ? hours : "0" + hours;
    minutes = minutes - (hours * 60);
    minutes = (minutes >= 10) ? minutes : "0" + minutes;
  }

  seconds = Math.floor(seconds % 60);
  seconds = (seconds >= 10) ? seconds : "0" + seconds;
  minutes = (minutes >= 10) ? minutes : "0" + minutes;

  if (hours !== "") {
    return hours + ":" + minutes + ":" + seconds;
  }
  return minutes + ":" + seconds;
}

const startStopwatch = (startTime) => {
  const start = startTime ? Date.now() - startTime : Date.now();
  time = Date.now() - start;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    try {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "timer-tick",
        time: formatStopwatchMilliseconds(time)
      });
    } catch (e) { }
  });
  clearInterval(stopwatchInterval);
  stopwatchInterval = setInterval(() => {
    time = Date.now() - start;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      try {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "timer-tick",
          time: formatStopwatchMilliseconds(time)
        });
      } catch (e) { }
    });
  }, 1000);

};

function stopInterval() {
  clearInterval(stopwatchInterval);
  time = 0;
}

chrome.runtime.onMessage.addListener(async (msg) => {
  switch (msg.type) {
    case "start":
      chrome.runtime.sendMessage({ type: "start", offscreen: true });
      break;
    case "stop":
      chrome.runtime.sendMessage({ type: "stop", offscreen: true });
    case "inject-content":
      recording = true;
      chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
        startStopwatch();
        return chrome.tabs.sendMessage(tabs[0].id, { type: 'inject-content' });
      });
      break;
    case "remove-content":
      recording = false;
      chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
        stopInterval();
        return chrome.tabs.sendMessage(tabs[0].id, { type: 'remove-content' });
      });
      break;
  }
});
