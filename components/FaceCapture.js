import React, { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

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
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading face-api.js models:", error);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    if (!modelsLoaded) {
      alert("Please wait! Models are still loading...");
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
      console.error("Error accessing webcam:", error);
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const captureImage = async () => {
    if (!modelsLoaded) {
      alert("Face model is still loading, please wait...");
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    // Create a canvas to capture the current frame from the video
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Detect face and compute its descriptor
      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected. Try again.");
        return;
      }

      // Convert the face descriptor to an array and get the captured image data URL
      const faceDescriptor = Array.from(detection.descriptor);
      const imageDataUrl = canvas.toDataURL('image/png');

      // Save the captured image and call the parent's onCapture callback
      setCapturedImage(imageDataUrl);
      onCapture(faceDescriptor);
      stopCamera();
    } catch (error) {
      console.error("Face detection error:", error);
      alert("Error detecting face. Try again.");
    }
  };

  const stopCamera = () => {
    setIsCameraOn(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div>
      {capturedImage ? (
        // Display captured image with an option to retake if needed
        <div>
          <img src={capturedImage} alt="Captured Face" width="300" height="300" />
          <button onClick={startCamera}>Retake</button>
        </div>
      ) : isCameraOn ? (
        // Show video feed along with buttons to capture or stop camera
        <div>
          <video ref={videoRef} autoPlay playsInline width="300" height="300" />
          <button onClick={captureImage}>Capture Image</button>
          <button onClick={stopCamera}>Stop Camera</button>
        </div>
      ) : (
        // Show start camera button when camera is off
        <button onClick={startCamera}>Start Camera</button>
      )}
    </div>
  );
};

export default FaceCapture;
