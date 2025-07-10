import React, { useState, useRef } from "react";

const Recorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [response, setResponse] = useState(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(audioChunks.current, { type: "audio/wav" });
      const file = new File([blob], "audio.wav", { type: "audio/wav" });
      setAudioUrl(URL.createObjectURL(blob));

      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("http://127.0.0.1:8000/api/speech-to-speech/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResponse(data);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
  };

  return (
    <div className="recorder">
      <h2>🎙️ Speech to Speech Translator</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && (
        <div>
          <h3>Your Speech:</h3>
          <audio src={audioUrl} controls />
        </div>
      )}

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h4>🔤 Transcription:</h4>
          <p>{response.transcription}</p>
          <h4>🤖 GPT Reply:</h4>
          <p>{response.reply_text}</p>
          <h4>🔈 AI Voice:</h4>
          <audio
            src={`http://127.0.0.1:8000/${response.audio_file}`}
            controls
          />
          <p>🗣 Language Detected: <strong>{response.detected_language}</strong></p>
        </div>
      )}
    </div>
  );
};

export default Recorder;
