import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { fetchFeaturedVideos, fetchRecommendations } from '../store/slices/videoSlice';
import VideoCard from '../components/VideoCard/VideoCard';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import styled from 'styled-components';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const Section = styled.section`
  padding: 2rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: white;
  font-weight: 600;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 1.2rem;
  color: #ccc;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #333;
    border-top: 3px solid #e50914;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SwiperContainer = styled.div`
  .swiper {
    padding: 0 0 2rem 0;
  }
  
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    background: rgba(0, 0, 0, 0.7);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    
    &:after {
      font-size: 16px;
    }
    
    &:hover {
      background: rgba(229, 9, 20, 0.8);
    }
  }
  
  .swiper-pagination-bullet {
    background: #666;
    
    &.swiper-pagination-bullet-active {
      background: #e50914;
    }
  }
`;

const SubscriptionBanner = styled.div`
  background: linear-gradient(135deg, #ff9800, #f57c00);
  padding: 1rem 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 80px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .message {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    
    .icon {
      font-size: 1.5rem;
    }
    
    .text {
      h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        font-weight: 600;
      }
      
      p {
        margin: 0;
        opacity: 0.95;
        font-size: 0.9rem;
      }
    }
  }
  
  button {
    background: white;
    color: #f57c00;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f5f5f5;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  }
`;

const Home = () => {
  const { profileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { featuredVideos, recommendations, loading, error } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);

  const [watchlist, setWatchlist] = useState([]);

  // Check if user has active subscription
  const hasActiveSubscription = user?.subscription?.status === 'active';

  useEffect(() => {
    if (profileId) {
      dispatch(fetchFeaturedVideos());
      dispatch(fetchRecommendations(profileId));
      
      const profile = user?.profiles?.find(p => p._id === profileId);
      if (profile) {
        setWatchlist(profile.watchlist || []);
      }
    }
  }, [dispatch, profileId, user]);

  const handleToggleWatchlist = async (videoId) => {
    try {
      setWatchlist(prev => 
        prev.includes(videoId) 
          ? prev.filter(id => id !== videoId)
          : [...prev, videoId]
      );
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header profileId={profileId} />
        <Loading>
          <div className="spinner"></div>
          Loading amazing content...
        </Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header profileId={profileId} />
        <Loading>
          <div>Error loading content. Please try again later.</div>
        </Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Header profileId={profileId} />
      
      {/* Show subscription banner if not subscribed */}
      {!hasActiveSubscription && (
        <SubscriptionBanner>
          <div className="message">
            <div className="icon">🔒</div>
            <div className="text">
              <h3>Subscribe now to watch all movies and TV shows without limits</h3>
            </div>
          </div>
          <button onClick={() => navigate('/subscription')}>
            View Plans
          </button>
        </SubscriptionBanner>
      )}
      
      {featuredVideos.length > 0 && (
        <Hero video={featuredVideos[0]} profileId={profileId} />
      )}

      {featuredVideos.length > 0 && (
        <Section>
          <SectionTitle>Trending Now</SectionTitle>
          <SwiperContainer>
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              spaceBetween={20}
              slidesPerView={4}
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
            >
              {featuredVideos.map((video) => (
                <SwiperSlide key={video._id}>
                  <VideoCard
                    video={video}
                    profileId={profileId}
                    isInWatchlist={watchlist.includes(video._id)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </SwiperContainer>
        </Section>
      )}

      {recommendations.length > 0 && (
        <Section>
          <SectionTitle>Recommended for You</SectionTitle>
          <VideoGrid>
            {recommendations.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                profileId={profileId}
                isInWatchlist={watchlist.includes(video._id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </VideoGrid>
        </Section>
      )}

      {featuredVideos.length === 0 && recommendations.length === 0 && !loading && (
        <Section>
          <div style={{ textAlign: 'center', padding: '4rem', color: '#ccc' }}>
            <h2>No content available</h2>
            <p>Check back later for new movies and shows!</p>
          </div>
        </Section>
      )}
    </Container>
  );
};

export default Home;
