import React, { useRef, useEffect } from "react";
import "../App.css";
import "./Page.css";

function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays and loops when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    }
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
        >
          <source src="/videos/home-background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default Home;

