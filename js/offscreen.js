chrome.runtime.onMessage.addListener((msg) => {
  if (!msg.offscreen) {
    return;
  }
  switch (msg.type) {
    case "start":
      startRecording();
      break;
    case "stop":
      stopRecording();
      break;
  }
});

let mediaRecorder;

async function recordScreen() {
  console.log("mediaRecorder 1 :", mediaRecorder);
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true
  });
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    ignoreMutedMedia: true
  });

  recordedChunks = [];
  mediaRecorder.ondataavailable = e => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };
  mediaRecorder.start();
  return chrome.runtime.sendMessage({ type: "inject-content" });;
}

function startRecording() {
  try {
    recordScreen();
  } catch (error) {
    alert(error)
  }
}

function stopRecording() {
  try {
    if (mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      chrome.runtime.sendMessage({ type: "remove-content" });
      setTimeout(() => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        a.click();
        URL.revokeObjectURL(url);
      }, 0);
    }
  } catch (error) {
    alert(error)
  }
}