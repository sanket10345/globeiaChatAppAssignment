# Real-Time Chat Application with Speech-to-Text and Face Matching

## Overview
This is a full-stack real-time chat application built with Next.js that includes:
- **User Authentication** with face matching using AWS Rekognition
- **Real-Time Chat Rooms** using Socket.IO
- **Speech-to-Text** integration via the Web Speech API

## Features
- **Signup/Login:** Users register and log in by providing a username, password, and a live selfie.
- **Chat Rooms:** Create and join chat rooms. Messages are exchanged in real time.
- **Speech-to-Text:** Convert speech to text before sending messages.
- **Secure:** Passwords are hashed and face data is verified using AWS Rekognition.
- **Deployment:** The application is designed for deployment on Vercel.

## Tech Stack
- **Frontend & Backend:** Next.js (React)
- **Database:** MongoDB
- **Real-Time Communication:** Socket.IO
- **Face Recognition:** AWS Rekognition
- **Speech-to-Text:** Web Speech API / (Google Speech-to-Text API integration possible)
- **Authentication:** JWT, bcrypt

## Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
