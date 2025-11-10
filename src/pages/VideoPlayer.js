import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaExpand } from 'react-icons/fa';
import { toast } from 'react-toastify';
import videoAPI from '../services/videoAPI';
import styled from 'styled-components';

const Container = styled.div`
  background: #000;
  min-height: 100vh;
  position: relative;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
`;

const Progress = styled.div`
  height: 100%;
  background: #e50914;
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const TimeDisplay = styled.span`
  color: white;
  font-size: 0.9rem;
  min-width: 100px;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VolumeSlider = styled.input`
  width: 80px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  font-size: 1.5rem;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const VideoInfo = styled.div`
  position: absolute;
  bottom: 8rem;
  left: 2rem;
  right: 2rem;
  color: white;
  z-index: 5;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  max-width: 600px;
  line-height: 1.6;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid #333;
    border-top: 3px solid #e50914;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SubscriptionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
  text-align: center;
  
  .icon {
    font-size: 5rem;
    margin-bottom: 2rem;
    color: #ff9800;
  }
  
  h2 {
    color: white;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #ccc;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 500px;
    line-height: 1.6;
  }
  
  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  button {
    padding: 1rem 2rem;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.subscribe {
      background: #ff9800;
      color: white;
      
      &:hover {
        background: #f57c00;
      }
    }
    
    &.back {
      background: #333;
      color: white;
      
      &:hover {
        background: #555;
      }
    }
  }
`;

const VideoPlayer = () => {
  const { videoId, profileId } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  
  const [video, setVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  
  let controlsTimeout = useRef(null);

  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription?.status === 'active';

  const fetchVideoDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await videoAPI.getVideoDetails(videoId);
      setVideo(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching video:', error);
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    // Redirect to subscription if not subscribed
    if (!hasActiveSubscription) {
      toast.error('Please subscribe to watch videos');
      // Don't fetch video if not subscribed
      return;
    }
    
    fetchVideoDetails();
  }, [videoId, hasActiveSubscription]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        if (playing) {
          setShowControls(false);
        }
      }, 3000);
    };

    const handleKeyPress = (e) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setPlaying(!playing);
          break;
        case 'ArrowLeft':
          seekTo(currentTime - 10);
          break;
        case 'ArrowRight':
          seekTo(currentTime + 10);
          break;
        case 'Escape':
          navigate(`/home/${profileId}`);
          break;
        default:
          break;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
      clearTimeout(controlsTimeout.current);
    };
  }, [playing, currentTime, navigate, profileId]);

  const updateWatchHistory = async (progress) => {
    try {
      await videoAPI.updateWatchHistory(videoId, profileId, progress);
    } catch (error) {
      console.error('Error updating watch history:', error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const seekTo = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time);
    }
  };

  const handleProgress = ({ played, playedSeconds }) => {
    setCurrentTime(playedSeconds);
    
    // Update watch history every 30 seconds
    if (Math.floor(playedSeconds) % 30 === 0) {
      updateWatchHistory(played * 100);
    }
  };

  const handleProgressBarClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    const newTime = progress * duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  if (!hasActiveSubscription) {
    return (
      <Container>
        <BackButton onClick={() => navigate(`/home/${profileId}`)}>
          <FaArrowLeft />
        </BackButton>

        <SubscriptionOverlay>
          <div className="icon">🔒</div>
          <h2>Subscription Required</h2>
          <p>
            You need an active subscription to watch this content. 
            Choose a plan that's right for you and start streaming unlimited movies and shows!
          </p>
          <div className="buttons">
            <button 
              className="subscribe" 
              onClick={() => navigate('/subscription')}
            >
              View Subscription Plans
            </button>
            <button 
              className="back" 
              onClick={() => navigate(`/home/${profileId}`)}
            >
              Go Back
            </button>
          </div>
        </SubscriptionOverlay>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>
          <div className="spinner"></div>
          Loading video...
        </LoadingSpinner>
      </Container>
    );
  }

  if (!video) {
    return (
      <Container>
        <LoadingSpinner>Video not found</LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container onMouseMove={() => setShowControls(true)}>
      <BackButton onClick={() => navigate(`/home/${profileId}`)}>
        <FaArrowLeft />
      </BackButton>

      <VideoContainer>
        <ReactPlayer
          ref={playerRef}
          url={video.videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={muted ? 0 : volume}
          muted={muted}
          onDuration={setDuration}
          onProgress={handleProgress}
          onReady={() => setLoading(false)}
          onError={(error) => console.error('Player error:', error)}
          config={{
            file: {
              attributes: {
                crossOrigin: 'anonymous'
              }
            }
          }}
        />
      </VideoContainer>

      <VideoInfo>
        <Title>{video.title}</Title>
        <Description>{video.description}</Description>
      </VideoInfo>

      <Controls $visible={showControls}>
        <ProgressBar onClick={handleProgressBarClick}>
          <Progress progress={(currentTime / duration) * 100} />
        </ProgressBar>
        
        <ControlsRow>
          <ControlButton onClick={() => setPlaying(!playing)}>
            {playing ? <FaPause /> : <FaPlay />}
          </ControlButton>
          
          <VolumeControl>
            <ControlButton onClick={toggleMute}>
              <FaVolumeUp />
            </ControlButton>
            <VolumeSlider
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </VolumeControl>
          
          <TimeDisplay>
            {formatTime(currentTime)} / {formatTime(duration)}
          </TimeDisplay>
          
          <div style={{ flex: 1 }} />
          
          <ControlButton onClick={toggleFullscreen}>
            <FaExpand />
          </ControlButton>
        </ControlsRow>
      </Controls>
    </Container>
  );
};

export default VideoPlayer;
