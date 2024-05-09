'use client'
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

function BackgroundVideo() {
  const playerRef = useRef(null);
  const [playDirection, setPlayDirection] = useState(1); // 1 pour avant, -1 pour arrière
  const [seekingTime, setSeekingTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleProgress = ({ played }) => {
    if (playDirection === 1 && played >= 0.99) {
      // Jouer en arrière quand la vidéo atteint la fin
      setPlayDirection(-1);
    } else if (playDirection === -1 && played <= 0.01) {
      // Rejouer en avant quand la vidéo atteint le début
      setPlayDirection(1);
    }
  };

  const handleDuration = (duration) => {
    setVideoDuration(duration);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (playDirection === -1) {
        // Décrémentez le temps actuel pour simuler un rebobinage
        setSeekingTime(time => Math.max(0, time - 0.5));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [playDirection]);

  useEffect(() => {
    if (playerRef.current && seekingTime !== null) {
      playerRef.current.seekTo(seekingTime, 'seconds');
    }
  }, [seekingTime]);

  return (
    <div className='video-background'>
      <ReactPlayer
        ref={playerRef}
        url="../../background.mp4"
        playing={true}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="100%"
        height="100%"
        muted={true}
        playsinline={true}
      />
    </div>
  );
}

export default BackgroundVideo;
