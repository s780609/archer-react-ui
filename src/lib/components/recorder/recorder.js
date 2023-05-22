import React, { useRef, useState, useEffect } from "react";

import "./recorder.css";

function Recorder({ onClose }) {
  const record = useRef();
  const stop = useRef();
  const soundClips = useRef();
  const canvas = useRef();
  const mainSection = useRef();

  const [audioBlobUrl, setAudioBlobUrl] = useState();

  useEffect(() => {
    stop.current.disabled = true;

    let audioCtx;
    const canvasCtx = canvas.current.getContext("2d");

    if (navigator.mediaDevices.getUserMedia) {
      const constraints = { audio: true };
      let chunks = [];

      let onSuccess = function (stream) {
        const options = {
          mediaType: "audio/mp3",
          audioBitsPerSecond: 128000,
        };
        const mediaRecorder = new MediaRecorder(stream, options);

        visualize(stream);

        record.current.onclick = function () {
          mediaRecorder.start();
          record.current.style.background = "red";

          stop.current.disabled = false;
          record.current.disabled = true;
        };

        stop.current.onclick = function () {
          mediaRecorder.stop();
          record.current.style.background = "";
          record.current.style.color = "";
          // mediaRecorder.requestData();

          stop.current.disabled = true;
          record.current.disabled = false;
        };

        mediaRecorder.onstop = function (e) {
          const blob = new Blob(chunks, { type: "audio/mp3" });
          chunks = [];

          const audioURL = window.URL.createObjectURL(blob);

          if (typeof onClose === "function") {
            setAudioBlobUrl(audioURL);
          } else {
            console.error(new Error("onClose is not a function"));
          }
        };

        mediaRecorder.ondataavailable = function (e) {
          chunks.push(e.data);
        };
      };

      let onError = function (err) {
        console.log("The following error occured: " + err);
      };

      navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
    } else {
      console.log("getUserMedia not supported on your browser!");
    }

    function visualize(stream) {
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }

      const source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      //analyser.connect(audioCtx.destination);

      draw();

      function draw() {
        if (!canvas.current) {
          return;
        }

        const WIDTH = canvas.current.width;
        const HEIGHT = canvas.current.height;

        requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = "rgb(200, 200, 200)";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0, 0, 0)";

        canvasCtx.beginPath();

        let sliceWidth = (WIDTH * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0;
          let y = (v * HEIGHT) / 2;

          if (i === 0) {
            canvasCtx.moveTo(x, y);
          } else {
            canvasCtx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
      }
    }
  }, []);

  const closeRecorder = () => {
    if (typeof onClose === "function") {
      onClose(audioBlobUrl);
    }
  };

  return (
    <>
      <section ref={mainSection} className="main-controls">
        <canvas ref={canvas} className="visualizer" height="60px"></canvas>
        <div id="recorder-buttons">
          <button ref={record} className="recorder-button">
            Record
          </button>
          <button ref={stop} className="recorder-button">
            Stop
          </button>
        </div>
        <br></br>
        <div>
          <button className="recorder-button w-full" onClick={closeRecorder}>
            結束錄音
          </button>
        </div>
      </section>
      <section ref={soundClips} className="sound-clips"></section>
    </>
  );
}

export default Recorder;
