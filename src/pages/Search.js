import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import Header from '../components/Header/Header';
import VideoCard from '../components/VideoCard/VideoCard';
import videoAPI from '../services/videoAPI';
import styled from 'styled-components';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const SearchHeader = styled.div`
  margin-bottom: 2rem;
`;

const SearchTitle = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const SearchSubtitle = styled.p`
  color: #ccc;
  font-size: 1.1rem;
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #333;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #555;
  }
`;

const FilterSelect = styled.select`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: #ccc;
  padding: 4rem 2rem;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
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

const Search = () => {
  const { profileId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    genre: '',
    type: '',
    year: ''
  });
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (searchQuery) {
      performSearch();
    }
  }, [searchQuery, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        search: searchQuery,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };
      
      const data = await videoAPI.searchVideos(searchQuery, searchFilters);
      setResults(data.videos || data);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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
        <SearchHeader>
          <SearchTitle>Search Results</SearchTitle>
          <SearchSubtitle>
            {searchQuery ? `Results for "${searchQuery}"` : 'Enter a search term'}
          </SearchSubtitle>
        </SearchHeader>

        {searchQuery && (
          <>
            <FiltersSection>
              <FilterButton>
                <FaFilter />
                Filters
              </FilterButton>
              
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
                <option value="Thriller">Thriller</option>
                <option value="Documentary">Documentary</option>
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
              
              <FilterSelect
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </FilterSelect>
            </FiltersSection>

            {loading ? (
              <LoadingSpinner>
                <div className="spinner"></div>
              </LoadingSpinner>
            ) : results.length > 0 ? (
              <ResultsGrid>
                {results.map((video) => (
                  <VideoCard
                    key={video._id}
                    video={video}
                    profileId={profileId}
                    isInWatchlist={watchlist.includes(video._id)}
                    onToggleWatchlist={handleToggleWatchlist}
                  />
                ))}
              </ResultsGrid>
            ) : (
              <NoResults>
                <h2>No results found</h2>
                <p>
                  We couldn't find anything matching "{searchQuery}".
                  <br />
                  Try different keywords or browse our categories.
                </p>
              </NoResults>
            )}
          </>
        )}
      </Content>
    </Container>
  );
};

export default Search;
