import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSearch, FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const BackButton = styled.button`
  background: #333;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background 0.3s ease;
  
  &:hover {
    background: #555;
  }
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-left: auto;
  
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  min-width: 250px;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
  
  @media (max-width: 768px) {
    min-width: auto;
    flex: 1;
  }
`;

const FilterSelect = styled.select`
  background: #333;
  color: white;
  border: 1px solid #555;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const AddButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #f40612;
  }
`;

const ContentTable = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    background: #2a2a2a;
    color: #ccc;
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    position: sticky;
    top: 0;
  }
  
  td {
    color: white;
    font-size: 0.95rem;
  }
  
  tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#f44336' : props.variant === 'primary' ? '#2196F3' : '#4CAF50'};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  
  &.active {
    background: rgba(76, 175, 80, 0.2);
    color: #4CAF50;
  }
  
  &.inactive {
    background: rgba(158, 158, 158, 0.2);
    color: #9e9e9e;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  
  button {
    background: #333;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover:not(:disabled) {
      background: #555;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      background: #e50914;
    }
  }
  
  span {
    color: #ccc;
  }
`;

const PreviewModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const PreviewContent = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: #333;
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #555;
    }
  }
  
  .video-title {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-right: 50px;
  }
  
  .video-details {
    color: #ccc;
    line-height: 1.6;
    
    .detail-item {
      margin-bottom: 0.75rem;
      
      strong {
        color: white;
      }
    }
  }
`;

const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
  
  input {
    width: 40px;
    height: 20px;
    position: relative;
    appearance: none;
    background: #555;
    border-radius: 20px;
    outline: none;
    cursor: pointer;
    transition: background 0.3s ease;
    
    &:checked {
      background: #e50914;
    }
    
    &::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      background: white;
      transition: transform 0.3s ease;
    }
    
    &:checked::before {
      transform: translateX(20px);
    }
  }
`;

const ContentManagement = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);
  const [previewVideo, setPreviewVideo] = useState(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchVideos();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, searchTerm, filterType, filterStatus, showInactive]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterType && { type: filterType }),
        ...(filterStatus && { status: filterStatus }),
        ...(showInactive && { showInactive: 'true' })
      });

      const response = await axios.get(`http://localhost:8000/api/admin/videos?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setVideos(response.data.videos || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalVideos(response.data.totalVideos || 0);
      } else {
        throw new Error(response.data.message || 'Failed to fetch videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error(error.response?.data?.message || 'Failed to load videos');
      setVideos([]);
      setTotalVideos(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video? It will be marked as inactive and hidden from users.')) {
      try {
        const response = await axios.delete(`http://localhost:8000/api/admin/videos/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          toast.success('Video deleted successfully');
          
          // Remove the video from current list immediately
          setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
          setTotalVideos(prev => Math.max(0, prev - 1));
          
          // Refresh to get accurate count
          setTimeout(() => fetchVideos(), 500);
        } else {
          throw new Error(response.data.message || 'Failed to delete video');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.response?.data?.message || 'Failed to delete video');
      }
    }
  };

  const handleToggleStatus = async (videoId, currentStatus) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/admin/videos/${videoId}/toggle-status`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchVideos();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error(error.response?.data?.message || 'Failed to update video status');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (type, value) => {
    if (type === 'type') {
      setFilterType(value);
    } else if (type === 'status') {
      setFilterStatus(value);
    }
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (video) => {
    setPreviewVideo(video);
  };

  const closePreview = () => {
    setPreviewVideo(null);
  };

  return (
    <Container>
      <Header />
      <Content>
        <PageHeader>
          <BackButton onClick={() => navigate('/admin')}>
            <FaArrowLeft />
          </BackButton>
          <Title>Content Management</Title>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search by title, description, cast, or director..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <FilterSelect value={filterType} onChange={(e) => handleFilterChange('type', e.target.value)}>
              <option value="">All Types</option>
              <option value="movie">Movies</option>
              <option value="series">TV Series</option>
              <option value="documentary">Documentaries</option>
            </FilterSelect>
            <FilterSelect value={filterStatus} onChange={(e) => handleFilterChange('status', e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FilterSelect>
            <ToggleSwitch>
              <span>Show Deleted</span>
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => {
                  setShowInactive(e.target.checked);
                  setCurrentPage(1);
                }}
              />
            </ToggleSwitch>
            <AddButton onClick={() => navigate('/admin/upload')}>
              <FaPlus />
              Add Content
            </AddButton>
          </SearchContainer>
        </PageHeader>

        <ContentTable>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc' }}>
              <div style={{ marginBottom: '1rem' }}>Loading content...</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Please wait while we fetch your videos</div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', color: '#ccc', fontSize: '0.9rem' }}>
                Showing {videos.length} of {totalVideos} videos
                {searchTerm && ` for "${searchTerm}"`}
                {filterType && ` • Type: ${filterType}`}
                {filterStatus && ` • Status: ${filterStatus}`}
                {showInactive && ' • Showing deleted videos'}
              </div>

              <Table>
                <thead>
                  <tr>
                    <th>Title & Uploader</th>
                    <th>Type</th>
                    <th>Genre</th>
                    <th>Views</th>
                    <th>Upload Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(video => (
                    <tr key={video._id}>
                      <td style={{ maxWidth: '250px' }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {video.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>
                          by {video.uploadedBy?.name || 'Unknown User'}
                        </div>
                        {video.imdbRating && (
                          <div style={{ fontSize: '0.8rem', color: '#ffd700', marginTop: '0.25rem' }}>
                            ⭐ {video.imdbRating}/10
                          </div>
                        )}
                      </td>
                      <td>
                        <span style={{ 
                          textTransform: 'capitalize',
                          padding: '0.25rem 0.5rem',
                          background: '#333',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}>
                          {video.type}
                        </span>
                      </td>
                      <td style={{ maxWidth: '150px' }}>
                        {video.genre?.slice(0, 2).join(', ')}
                        {video.genre?.length > 2 && '...'}
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>
                          {video.views?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>
                          views
                        </div>
                      </td>
                      <td>
                        <div>
                          {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#999' }}>
                          {new Date(video.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </td>
                      <td>
                        <StatusBadge 
                          className={video.isActive ? 'active' : 'inactive'}
                          onClick={() => handleToggleStatus(video._id, video.isActive)}
                          style={{ cursor: 'pointer' }}
                          title="Click to toggle status"
                        >
                          {video.isActive ? 'Active' : 'Inactive'}
                        </StatusBadge>
                      </td>
                      <td>
                        <ActionButtons>
                          <ActionButton
                            variant="primary"
                            onClick={() => handleViewDetails(video)}
                            title="View Details"
                          >
                            <FaEye />
                          </ActionButton>
                          <ActionButton
                            variant="success"
                            onClick={() => navigate(`/admin/videos/${video._id}/edit`)}
                            title="Edit Video"
                          >
                            <FaEdit />
                          </ActionButton>
                          <ActionButton
                            variant="danger"
                            onClick={() => handleDelete(video._id)}
                            title="Delete Video"
                          >
                            <FaTrash />
                          </ActionButton>
                        </ActionButtons>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {videos.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc' }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No videos found</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                    {searchTerm || filterType || filterStatus 
                      ? 'Try adjusting your search or filters'
                      : 'Start by uploading your first video'
                    }
                  </div>
                  {!searchTerm && !filterType && !filterStatus && (
                    <AddButton 
                      onClick={() => navigate('/admin/upload')}
                      style={{ marginTop: '1rem' }}
                    >
                      <FaPlus />
                      Upload First Video
                    </AddButton>
                  )}
                </div>
              )}

              {totalPages > 1 && (
                <Pagination>
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum ? 'active' : ''}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                  
                  <span style={{ marginLeft: '1rem' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                </Pagination>
              )}
            </>
          )}
        </ContentTable>

        {/* Preview Modal */}
        {previewVideo && (
          <PreviewModal onClick={closePreview}>
            <PreviewContent onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closePreview}>
                ×
              </button>
              
              <h2 className="video-title">{previewVideo.title}</h2>
              
              <div className="video-details">
                <div className="detail-item">
                  <strong>Type:</strong> {previewVideo.type}
                </div>
                <div className="detail-item">
                  <strong>Genre:</strong> {previewVideo.genre?.join(', ') || 'Not specified'}
                </div>
                <div className="detail-item">
                  <strong>Release Year:</strong> {previewVideo.releaseYear || 'Not specified'}
                </div>
                <div className="detail-item">
                  <strong>Rating:</strong> {previewVideo.rating || 'Not rated'}
                </div>
                {previewVideo.imdbRating && (
                  <div className="detail-item">
                    <strong>IMDB Rating:</strong> {previewVideo.imdbRating}/10
                  </div>
                )}
                {previewVideo.director && (
                  <div className="detail-item">
                    <strong>Director:</strong> {previewVideo.director}
                  </div>
                )}
                {previewVideo.producer && (
                  <div className="detail-item">
                    <strong>Producer:</strong> {previewVideo.producer}
                  </div>
                )}
                <div className="detail-item">
                  <strong>Views:</strong> {previewVideo.views?.toLocaleString() || 0}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> {previewVideo.isActive ? 'Active' : 'Inactive'}
                </div>
                <div className="detail-item">
                  <strong>Uploaded by:</strong> {previewVideo.uploadedBy?.name || 'Unknown'}
                </div>
                <div className="detail-item">
                  <strong>Upload Date:</strong> {new Date(previewVideo.createdAt).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Description:</strong><br />
                  {previewVideo.description}
                </div>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(`/admin/videos/${previewVideo._id}/edit`)}
                    style={{
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Video
                  </button>
                  <button
                    onClick={() => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      const profileId = user.profiles?.[0]?._id;
                      if (profileId) {
                        window.open(`/details/${previewVideo._id}/${profileId}`, '_blank');
                      } else {
                        window.open(`/details/${previewVideo._id}`, '_blank');
                      }
                    }}
                    style={{
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    View Full Page
                  </button>
                </div>
              </div>
            </PreviewContent>
          </PreviewModal>
        )}
      </Content>
    </Container>
  );
};

export default ContentManagement;
