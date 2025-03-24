import React, { useState } from 'react';

const SpeechToText = ({ onTranscribe }) => {
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      onTranscribe(result);
    };
  };

  return (
    <div>
      <button onClick={startListening}>Start Speaking</button>
      <textarea
        value={transcript}
        onChange={(e) => {
          setTranscript(e.target.value);
          onTranscribe(e.target.value);
        }}
        rows="3"
        cols="50"
        placeholder="Transcribed text will appear here..."
      ></textarea>
    </div>
  );
};

export default SpeechToText;
