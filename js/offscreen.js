chrome.runtime.onMessage.addListener((msg) => {
  if (!msg.offscreen) {
    return;
  }
  switch (msg.type) {
    case "start":
      startRecording();
      break;
    case "stop":
      mediaRecorder.stop();
      break;
  }
});

let mediaRecorder;
let stream;

async function recordScreen() {
   stream = await navigator.mediaDevices.getDisplayMedia({
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
  setTimeout(() => {
    mediaRecorder.onstop = () => {
      stopRecording();
    }
  }, 0);
  return chrome.runtime.sendMessage({ type: "inject-content" });;
}

function startRecording() {
  try {
    recordScreen();
  } catch (error) {
    alert(error)
  }
}

// setInterval(() => {
//   console.log({stream})
// }, 1000);


function stopRecording() {
  try {
      chrome.runtime.sendMessage({ type: "remove-content" });
      stream.getTracks().forEach(track => track.stop());
      setTimeout(() => {
        console.log({recordedChunks})
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "recording.webm";
        a.click();
        URL.revokeObjectURL(url);
      }, 0);
   
  } catch (error) {
    alert(error)
  }
}