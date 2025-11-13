import React, { useRef, useEffect, useState } from "react";
import "../App.css";
import "./Page.css";
import { Scene, Lighting, OrbitControls, Jaguar } from "../components/three";

function Home() {
  const videoRef = useRef(null);
  const [showJaguar, setShowJaguar] = useState(false);
  const [videoFaded, setVideoFaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = false;
      video.playsInline = true;

      const handleVideoEnd = () => {
        video.style.transition = 'opacity 3s ease-in-out';
        video.style.opacity = '0';
        setVideoFaded(true);
        
        setTimeout(() => {
          setShowJaguar(true);
        }, 3000);
      };

      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video is playing');
          })
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

      video.addEventListener('ended', handleVideoEnd);
      
      video.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        console.log('Make sure the video file exists at: /videos/jvid_01.mp4');
      });
      
      video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
      });
      
      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        if (video) {
          video.pause();
        }
      };
    }
  }, []);

  return (
    <div className="home-page">
      <div className="video-background">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`home-video ${videoFaded ? 'video-fade-out' : ''}`}
          preload="auto"
        >
          <source src="/videos/jvid_01.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video-fallback">
          <p>[VIDEO NOT FOUND]</p>
          <p style={{fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7}}>
            Place jvid_01.mp4 in frontend/public/videos/
          </p>
        </div>
      </div>
      
      {showJaguar && (
        <div className={`jaguar-3d-container ${showJaguar ? 'visible' : ''}`}>
          <Scene>
            <Lighting />
            <Jaguar position={[0, 0, 0]} />
            <OrbitControls enableZoom={true} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
          </Scene>
        </div>
      )}
    </div>
  );
}

export default Home;

