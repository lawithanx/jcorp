import React, { useRef, useEffect } from "react";
import "../App.css";
import "./Page.css";

function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays and loops when component mounts
    const video = videoRef.current;
    if (video) {
      // Set video properties
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      // Try to play the video
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video is playing');
          })
          .catch((error) => {
            console.log('Video autoplay prevented:', error);
            // Try again on user interaction
            const handleInteraction = () => {
              video.play().catch(console.error);
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('touchstart', handleInteraction);
            };
            document.addEventListener('click', handleInteraction);
            document.addEventListener('touchstart', handleInteraction);
          });
      }
      
      // Handle video loading errors
      video.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        console.log('Make sure the video file exists at: /videos/home-background.mp4');
      });
      
      // Handle video loaded
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
      });
    }
    
    return () => {
      // Cleanup if needed
      if (video) {
        video.pause();
      }
    };
  }, []);

  return (
    <div className="home-page">
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="home-video"
          preload="auto"
        >
          <source src="/videos/home-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Fallback if video doesn't load */}
        <div className="video-fallback">
          <p>[VIDEO NOT FOUND]</p>
          <p style={{fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7}}>
            Place home-background.mp4 in frontend/public/videos/
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;

