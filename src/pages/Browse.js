import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../store/slices/videoSlice';
import VideoCard from '../components/VideoCard/VideoCard';
import Header from '../components/Header/Header';
import styled from 'styled-components';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
  padding-top: 80px;
`;

const Content = styled.div`
  padding: 2rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
`;

const Browse = () => {
  const { profileId } = useParams();
  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);

  const [filters, setFilters] = useState({
    genre: '',
    type: '',
    search: ''
  });
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    dispatch(fetchVideos(filters));
    
    const profile = user?.profiles?.find(p => p._id === profileId);
    if (profile) {
      setWatchlist(profile.watchlist || []);
    }
  }, [dispatch, filters, profileId, user]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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

  return (
    <Container>
      <Header profileId={profileId} />
      <Content>
        <Title>Browse</Title>
        
        <Filters>
          <FilterSelect 
            value={filters.genre} 
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
          </FilterSelect>
          
          <FilterSelect 
            value={filters.type} 
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">TV Series</option>
            <option value="documentary">Documentaries</option>
          </FilterSelect>
        </Filters>

        {loading ? (
          <LoadingSpinner>Loading content...</LoadingSpinner>
        ) : (
          <VideoGrid>
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                profileId={profileId}
                isInWatchlist={watchlist.includes(video._id)}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ))}
          </VideoGrid>
        )}
      </Content>
    </Container>
  );
};

export default Browse;
