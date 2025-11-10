import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaPlay, FaPlus, FaCheck, FaInfo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const CardContainer = styled(motion.div)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #1a1a1a;
  transition: transform 0.3s ease;
`;

const Thumbnail = styled.div`
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  
  button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid white;
    background: rgba(42, 42, 42, 0.6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.1);
    }
    
    svg {
      font-size: 1rem;
    }
  }
`;

const Info = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  color: white;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  
  span {
    color: #ccc;
    
    &.year {
      color: #46d369;
    }
    
    &.rating {
      border: 1px solid #ccc;
      padding: 0.1rem 0.3rem;
      font-size: 0.75rem;
    }
  }
`;

const Genres = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  span {
    color: #999;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const VideoCard = ({ video, profileId, isInWatchlist, onToggleWatchlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription?.status === 'active';

  const handleCardClick = () => {
    navigate(`/details/${video._id}/${profileId}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    
    // Check subscription status
    if (!hasActiveSubscription) {
      toast.error('Please subscribe to watch videos!', {
        autoClose: 3000,
        onClick: () => navigate('/subscription')
      });
      
      // Redirect to subscription page after a short delay
      setTimeout(() => {
        navigate('/subscription');
      }, 1500);
      return;
    }

    navigate(`/watch/${video._id}/${profileId}`);
  };

  const handleInfo = (e) => {
    e.stopPropagation();
    navigate(`/details/${video._id}/${profileId}`);
  };

  const handleToggleWatchlist = (e) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(video._id);
    }
  };

  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Thumbnail>
        <img src={video.thumbnail} alt={video.title} />
      </Thumbnail>
      
      <Overlay $isVisible={isHovered}>
        <Controls>
          <motion.button
            onClick={handlePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              background: hasActiveSubscription ? '#e50914' : '#ff9800',
              position: 'relative'
            }}
            title={hasActiveSubscription ? 'Play video' : 'Subscribe to watch'}
          >
            <FaPlay />
            {!hasActiveSubscription && (
              <span style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ff9800',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                Subscribe
              </span>
            )}
          </motion.button>
          
          <motion.button
            onClick={handleToggleWatchlist}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isInWatchlist ? <FaCheck /> : <FaPlus />}
          </motion.button>
          
          <motion.button
            onClick={handleInfo}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaInfo />
          </motion.button>
        </Controls>
        
        <Info>
          <Title>{video.title}</Title>
          <Meta>
            <span className="year">{video.releaseYear}</span>
            <span className="rating">{video.rating}</span>
            {video.duration && <span className="duration">{video.duration}m</span>}
          </Meta>
          <Genres>
            {video.genre?.slice(0, 3).map((genre, index) => (
              <span key={index}>{genre}</span>
            ))}
          </Genres>
        </Info>
      </Overlay>
    </CardContainer>
  );
};

export default VideoCard;
