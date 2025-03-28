import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const videoContainerStyle = {
  margin: '1rem 0',
  textAlign: 'center',
};

const buttonContainerStyle = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'center',
  marginTop: '0.5rem',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  backgroundColor: '#6366f1', // Indigo
  color: '#fff',
  fontWeight: 'bold',
};

const FaceCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setModelsLoaded(true);
        console.log('Models loaded successfully');
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    if (!modelsLoaded) {
      alert('Please wait! Models are still loading...');
      return;
    }
    // Clear any previous captured image
    setCapturedImage(null);
    setIsCameraOn(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      alert('Could not access camera. Please allow camera permissions.');
    }
  };

  const captureImage = async () => {
    if (!modelsLoaded) {
      alert('Face model is still loading, please wait...');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert('No face detected. Try again.');
        return;
      }

      const faceDescriptor = Array.from(detection.descriptor);
      const imageDataUrl = canvas.toDataURL('image/png');

      setCapturedImage(imageDataUrl);
      onCapture(faceDescriptor);
      stopCamera();
    } catch (error) {
      console.error('Face detection error:', error);
      alert('Error detecting face. Try again.');
    }
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div style={videoContainerStyle}>
      {capturedImage ? (
        <div>
          <img
            src={capturedImage}
            alt="Captured Face"
            style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div style={buttonContainerStyle}>
            <button onClick={startCamera} style={buttonStyle}>
              Retake
            </button>
          </div>
        </div>
      ) : isCameraOn ? (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '200px', height: '200px', borderRadius: '4px', objectFit: 'cover' }}
          />
          <div style={buttonContainerStyle}>
            <button onClick={captureImage} style={buttonStyle}>
              Capture
            </button>
            <button onClick={stopCamera} style={buttonStyle}>
              Stop
            </button>
          </div>
        </div>
      ) : (
        <button onClick={startCamera} style={buttonStyle}>
          Start Camera
        </button>
      )}
    </div>
  );
};

export default FaceCapture;
