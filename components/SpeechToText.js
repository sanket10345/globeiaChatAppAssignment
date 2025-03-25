import React, { useState, useEffect } from "react";

const SpeechToText = ({ onTranscribe }) => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [countdown, setCountdown] = useState(0);

  let recognition;

  useEffect(() => {
    if (listening && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && listening) {
      stopListening();
    }
  }, [countdown, listening]);

  const startListening = () => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    setListening(true);
    setCountdown(10); // Set countdown to 10 seconds
    setTranscript("");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      onTranscribe(result);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
      setListening(false);
      setCountdown(0);
    };

    // Automatically stop recognition after 10 seconds
    setTimeout(() => {
      stopListening();
      setTranscript("");
    }, 10000);
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setListening(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {listening ? (
        <p style={{ color: "red", fontWeight: "bold" }}>Listening... {countdown}s</p>
      ) : (
        <button 
          onClick={startListening} 
          style={{
            padding: "10px 20px",
            background: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Start Speaking
        </button>
      )}

      {transcript && (
        <div style={{ marginTop: "15px" }}>
          <textarea
            value={transcript}
            readOnly
            rows="3"
            cols="50"
            style={{ width: "80%", padding: "10px", fontSize: "16px" }}
          />
          <br />
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
