import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaThumbsDown, FaShare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import videoAPI from '../services/videoAPI';
import styled from 'styled-components';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  position: relative;
  height: 70vh;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(20, 20, 20, 0.8) 70%,
    #141414 100%
  ), url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 0 4rem 4rem;
  
  @media (max-width: 768px) {
    padding: 0 2rem 2rem;
    height: 60vh;
  }
`;

const HeroContent = styled(motion.div)`
  max-width: 600px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  color: #ccc;
  
  .year { color: #46d369; }
  .rating { 
    border: 1px solid #ccc;
    padding: 0.2rem 0.5rem;
    font-size: 0.9rem;
  }
  .duration { color: #ccc; }
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #ccc;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PlayButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  color: black;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

const SecondaryButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(109, 109, 110, 0.7);
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(109, 109, 110, 0.4);
  }
`;

const IconButton = styled(motion.button)`
  width: 50px;
  height: 50px;
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
  }
`;

const ContentSection = styled.section`
  padding: 2rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #333;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? 'white' : '#ccc'};
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem 0;
  border-bottom: 2px solid ${props => props.active ? '#e50914' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
  }
`;

const EpisodesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EpisodeCard = styled(motion.div)`
  background: #2a2a2a;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #3a3a3a;
  }
`;

const EpisodeThumbnail = styled.div`
  width: 140px;
  height: 80px;
  background: url(${props => props.src}) center/cover;
  border-radius: 4px;
  position: relative;
  
  .play-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    svg {
      font-size: 2rem;
    }
  }
  
  &:hover .play-overlay {
    opacity: 1;
  }
`;

const EpisodeInfo = styled.div`
  flex: 1;
  
  .episode-number {
    color: #ccc;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .episode-title {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .episode-description {
    color: #ccc;
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .episode-duration {
    color: #999;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
`;

const SeasonSelector = styled.select`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const CastSection = styled.div`
  margin-top: 2rem;
  
  .cast-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .cast-member {
    text-align: center;
    
    .cast-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #333;
      margin: 0 auto 0.5rem;
    }
    
    .cast-name {
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .cast-role {
      color: #ccc;
      font-size: 0.8rem;
    }
  }
`;

const VideoDetails = () => {
  const { videoId, profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [video, setVideo] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [activeTab, setActiveTab] = useState('episodes');
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use first profile if no profileId provided (admin case)
  const activeProfileId = profileId || user?.profiles?.[0]?._id;

  useEffect(() => {
    fetchVideoDetails();
    if (video?.type === 'series') {
      fetchEpisodes();
    }
  }, [videoId, selectedSeason]);

  const fetchVideoDetails = async () => {
    try {
      const data = await videoAPI.getVideoDetails(videoId);
      setVideo(data);
      setLoading(false);
      
      // Set default season if series
      if (data.type === 'series' && data.seasons && data.seasons.length > 0) {
        setSelectedSeason(data.seasons[0].seasonNumber);
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    try {
      // If we have the video data with seasons, extract episodes directly
      if (video && video.seasons) {
        const season = video.seasons.find(s => s.seasonNumber === selectedSeason);
        if (season && season.episodes) {
          setEpisodes(season.episodes);
          return;
        }
      }
      
      // Fallback to API call
      const data = await videoAPI.getEpisodes(videoId, selectedSeason);
      setEpisodes(data);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      // If API fails, try to get episodes from video data
      if (video && video.seasons) {
        const season = video.seasons.find(s => s.seasonNumber === selectedSeason);
        if (season && season.episodes) {
          setEpisodes(season.episodes);
        }
      }
    }
  };

  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription?.status === 'active';

  const handlePlay = (episodeId = null) => {
    if (!activeProfileId) {
      toast.error('Please select a profile first');
      navigate('/profiles');
      return;
    }

    // Check subscription status
    if (!hasActiveSubscription) {
      toast.error('🔒 Please subscribe to watch videos!', {
        autoClose: 4000,
        onClick: () => navigate('/subscription')
      });
      
      // Show subscription modal or redirect
      setTimeout(() => {
        navigate('/subscription');
      }, 1500);
      return;
    }

    if (video.type === 'series' && episodeId) {
      navigate(`/watch/${videoId}/${activeProfileId}?episode=${episodeId}`);
    } else {
      navigate(`/watch/${videoId}/${activeProfileId}`);
    }
  };

  const toggleWatchlist = async () => {
    if (!activeProfileId) {
      toast.error('Please select a profile first');
      return;
    }

    try {
      await videoAPI.toggleWatchlist(videoId, activeProfileId);
      setIsInWatchlist(!isInWatchlist);
      toast.success(isInWatchlist ? 'Removed from watchlist' : 'Added to watchlist');
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  if (loading) {
    return (
      <Container>
        <Header profileId={profileId} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'white' 
        }}>
          Loading...
        </div>
      </Container>
    );
  }

  if (!video) {
    return (
      <Container>
        <Header profileId={profileId} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'white' 
        }}>
          Video not found
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header profileId={activeProfileId} />
      
      <HeroSection $backgroundImage={video.thumbnail}>
        <HeroContent
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>{video.title}</Title>
          
          <MetaInfo>
            <span className="year">{video.releaseYear}</span>
            <span className="rating">{video.rating}</span>
            {video.type === 'movie' && video.duration && (
              <span className="duration">{video.duration} min</span>
            )}
            {video.type === 'series' && (
              <span className="duration">
                {video.seasons?.reduce((total, season) => total + season.episodes.length, 0) || 0} Episodes
              </span>
            )}
          </MetaInfo>
          
          <Description>{video.description}</Description>
          
          {/* Subscription warning if not subscribed */}
          {!hasActiveSubscription && (
            <div style={{
              background: 'rgba(255, 152, 0, 0.2)',
              border: '1px solid #ff9800',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🔒</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                  Subscription Required
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  Subscribe now to watch this content and unlock unlimited streaming
                </div>
              </div>
            </div>
          )}
          
          <ActionButtons>
            <PlayButton
              onClick={() => handlePlay()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: hasActiveSubscription ? 'white' : '#ff9800',
                color: hasActiveSubscription ? 'black' : 'white'
              }}
            >
              {hasActiveSubscription ? (
                <>
                  <FaPlay />
                  Play
                </>
              ) : (
                <>
                  🔒 Subscribe to Watch
                </>
              )}
            </PlayButton>
            
            {activeProfileId && (
              <SecondaryButton
                onClick={toggleWatchlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isInWatchlist ? <FaCheck /> : <FaPlus />}
                {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              </SecondaryButton>
            )}
            
            <IconButton whileHover={{ scale: 1.1 }}>
              <FaThumbsUp />
            </IconButton>
            
            <IconButton whileHover={{ scale: 1.1 }}>
              <FaShare />
            </IconButton>
          </ActionButtons>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        {video.type === 'series' ? (
          <>
            <TabContainer>
              <Tab 
                active={activeTab === 'episodes'} 
                onClick={() => setActiveTab('episodes')}
              >
                Episodes
              </Tab>
              <Tab 
                active={activeTab === 'details'} 
                onClick={() => setActiveTab('details')}
              >
                Details & More
              </Tab>
            </TabContainer>

            {activeTab === 'episodes' && (
              <>
                {video.seasons && video.seasons.length > 1 && (
                  <SeasonSelector 
                    value={selectedSeason} 
                    onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
                  >
                    {video.seasons.map(season => (
                      <option key={season.seasonNumber} value={season.seasonNumber}>
                        Season {season.seasonNumber}
                      </option>
                    ))}
                  </SeasonSelector>
                )}

                <EpisodesList>
                  {episodes.length > 0 ? (
                    episodes.map((episode, index) => (
                      <EpisodeCard
                        key={episode._id || index}
                        onClick={() => handlePlay(episode._id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <EpisodeThumbnail src={episode.thumbnail || video.thumbnail}>
                          <div className="play-overlay">
                            <FaPlay />
                          </div>
                        </EpisodeThumbnail>
                        
                        <EpisodeInfo>
                          <div className="episode-number">
                            {episode.episodeNumber}. {episode.title}
                          </div>
                          <div className="episode-description">
                            {episode.description || `Episode ${episode.episodeNumber} of ${video.title}`}
                          </div>
                          <div className="episode-duration">
                            {episode.duration || 45} min
                          </div>
                        </EpisodeInfo>
                      </EpisodeCard>
                    ))
                  ) : (
                    <div style={{ color: '#ccc', textAlign: 'center', padding: '2rem' }}>
                      {loading ? 'Loading episodes...' : 'No episodes found for this season.'}
                    </div>
                  )}
                </EpisodesList>
              </>
            )}

            {activeTab === 'details' && (
              <div>
                <SectionTitle>About {video.title}</SectionTitle>
                <p style={{ color: '#ccc', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {video.description}
                </p>
                
                {video.cast && video.cast.length > 0 && (
                  <CastSection>
                    <SectionTitle>Cast</SectionTitle>
                    <div className="cast-grid">
                      {video.cast.map((member, index) => (
                        <div key={index} className="cast-member">
                          <div className="cast-image"></div>
                          <div className="cast-name">{member.name}</div>
                          <div className="cast-role">{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </CastSection>
                )}
              </div>
            )}
          </>
        ) : (
          // Movie details
          <div>
            <SectionTitle>About {video.title}</SectionTitle>
            <p style={{ color: '#ccc', lineHeight: 1.6, marginBottom: '2rem' }}>
              {video.description}
            </p>
            
            {video.cast && video.cast.length > 0 && (
              <CastSection>
                <SectionTitle>Cast</SectionTitle>
                <div className="cast-grid">
                  {video.cast.map((member, index) => (
                    <div key={index} className="cast-member">
                      <div className="cast-image"></div>
                      <div className="cast-name">{member.name}</div>
                      <div className="cast-role">{member.role}</div>
                    </div>
                  ))}
                </div>
              </CastSection>
            )}
          </div>
        )}
      </ContentSection>
    </Container>
  );
};

export default VideoDetails;
