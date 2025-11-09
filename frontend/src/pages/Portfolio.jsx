import React, { useRef, useEffect } from 'react';
import './Page.css';

function Portfolio() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('Video is playing'))
          .catch((error) => {
            console.log('Video autoplay prevented:', error);
            const handleInteraction = () => {
              video.play().catch(console.error);
              document.removeEventListener('click', handleInteraction);
              document.removeEventListener('touchstart', handleInteraction);
            };
            document.addEventListener('click', handleInteraction);
            document.addEventListener('touchstart', handleInteraction);
          });
      }
    }
    
    return () => {
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
        <div className="video-fallback">
          <p>[VIDEO NOT FOUND]</p>
        </div>
      </div>
      
      <div className="page-content-container">
        <div className="business-card-template">
          <div className="page-header" style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.2)'}}>
            <h1 className="page-title">PORTFOLIO</h1>
            <p className="page-subtitle">CLASSIFIED PROJECT FILES</p>
          </div>

          <div className="portfolio-content">
            <p>Portfolio content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;

