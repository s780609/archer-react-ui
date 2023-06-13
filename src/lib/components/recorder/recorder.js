import React, { useRef, useState, useEffect } from "react";

import styled from "styled-components";

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

  const MainControls = styled.section`
    padding: 0.5rem 0;
  `;
  const Visualizer = styled.canvas`
    width: 100%;
    height: 60px;
    display: block;
    margin-bottom: 0.5rem;
  `;
  const RecorderButtons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `;
  const RecorderButton = styled.button`
    font-size: 1rem;
    background: #0088cc;
    text-align: center;
    color: white;
    border: none;
    transition: all 0.2s;
    padding: 0.5rem;
    padding: 1rem;
    width: calc(50% - 0.25rem);
    &:hover {
      box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 1);
      background: #0ae;
    }
    &:focus {
      box-shadow: inset 0px 0px 10px rgba(255, 255, 255, 1);
      background: #0ae;
    }
    &:active {
      box-shadow: inset 0px 0px 20px rgba(0, 0, 0, 0.5);
      transform: translateY(2px);
    }
  `;

  const SoundClips = styled.section`
    flex: 1;
    overflow: auto;
  `;

  return (
    <>
      <MainControls ref={mainSection}>
        <Visualizer ref={canvas} height="60px"></Visualizer>
        <RecorderButtons>
          <RecorderButton ref={record}>Record</RecorderButton>
          <RecorderButton ref={stop}>Stop</RecorderButton>
        </RecorderButtons>
        <br></br>
        <div>
          <RecorderButton className="w-full" onClick={closeRecorder}>
            結束錄音
          </RecorderButton>
        </div>
      </MainControls>
      <SoundClips ref={soundClips}></SoundClips>
    </>
  );
}

export default Recorder;
