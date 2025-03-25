// pages/_app.js
import { useEffect } from 'react';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize the socket server by calling the API route
    fetch('/api/socket');
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
