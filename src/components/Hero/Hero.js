import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import styled from 'styled-components';

const HeroContainer = styled.div`
  position: relative;
  height: 80vh;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.8) 100%
  ), url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  margin-top: ${props => props.$hasSubscriptionBanner ? '0' : '0'};
  
  @media (max-width: 768px) {
    height: 60vh;
    padding: 0 2rem;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 600px;
  color: white;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  opacity: 0.8;
`;

const MetaItem = styled.span`
  &:not(:last-child)::after {
    content: '•';
    margin-left: 1rem;
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const HeroButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.primary {
    background: white;
    color: black;
    
    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }
  }
  
  &.secondary {
    background: rgba(109, 109, 110, 0.7);
    color: white;
    
    &:hover {
      background: rgba(109, 109, 110, 0.4);
    }
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 1;
`;

const Hero = ({ video, profileId }) => {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate(`/watch/${video._id}/${profileId}`);
  };

  const handleMoreInfo = () => {
    navigate(`/details/${video._id}/${profileId}`);
  };

  return (
    <HeroContainer $backgroundImage={video.thumbnail}>
      <Overlay />
      <HeroContent
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <HeroTitle>{video.title}</HeroTitle>
        
        <HeroMeta>
          <MetaItem>{video.releaseYear}</MetaItem>
          <MetaItem>{video.rating}</MetaItem>
          <MetaItem>{video.type === 'movie' ? `${video.duration} min` : 'Series'}</MetaItem>
        </HeroMeta>
        
        <HeroDescription>
          {video.description.length > 200 
            ? `${video.description.substring(0, 200)}...`
            : video.description
          }
        </HeroDescription>
        
        <ButtonGroup>
          <HeroButton
            className="primary"
            onClick={handlePlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay />
            Play
          </HeroButton>
          
          <HeroButton
            className="secondary"
            onClick={handleMoreInfo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaInfoCircle />
            More Info
          </HeroButton>
        </ButtonGroup>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;
