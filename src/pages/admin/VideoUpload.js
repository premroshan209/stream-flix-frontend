import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUpload, FaArrowLeft, FaVideo, FaImage, FaFilm } from 'react-icons/fa';
import Header from '../../components/Header/Header';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
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

const Form = styled.form`
  background: #1a1a1a;
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid #333;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e50914;
  display: inline-block;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '1fr'};
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.875rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const TextArea = styled.textarea`
  padding: 0.875rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const Select = styled.select`
  padding: 0.875rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed ${props => props.isDragOver ? '#e50914' : '#555'};
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isDragOver ? 'rgba(229, 9, 20, 0.05)' : 'transparent'};
  
  &:hover {
    border-color: #e50914;
    background: rgba(229, 9, 20, 0.05);
  }
  
  input {
    display: none;
  }
  
  .upload-icon {
    font-size: 3rem;
    color: #666;
    margin-bottom: 1rem;
    transition: color 0.3s ease;
  }
  
  &:hover .upload-icon {
    color: #e50914;
  }
  
  .upload-text {
    color: #ccc;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .upload-hint {
    color: #888;
    font-size: 0.9rem;
  }
  
  .file-info {
    color: #e50914;
    font-weight: 600;
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
`;

const GenreItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ccc;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  input {
    margin: 0;
    accent-color: #e50914;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: ${props => props.disabled ? '#666' : '#e50914'};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #f40612;
    transform: translateY(-2px);
  }
  
  .loading {
    width: 20px;
    height: 20px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const VideoUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState({ video: false, thumbnail: false, trailer: false });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    releaseYear: new Date().getFullYear(),
    duration: '',
    rating: 'PG',
    imdbRating: '',
    director: '',
    producer: '',
    language: 'en',
    genres: [],
    tags: '',
    seasonNumber: 1
  });
  
  const [files, setFiles] = useState({
    video: null,
    thumbnail: null,
    trailer: null,
    episodes: [] // For series
  });

  const [episodes, setEpisodes] = useState([
    { title: '', description: '', duration: 45, file: null }
  ]);

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 
    'Thriller', 'Documentary', 'Animation', 'Adventure', 'Crime', 'Fantasy'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleFileChange = (type, file) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileChange(type, droppedFiles[0]);
    }
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setFormData(prev => ({ ...prev, type: newType }));
    
    // Reset episode data when switching from series to movie
    if (newType === 'movie') {
      setEpisodes([]);
      setFiles(prev => ({ ...prev, episodes: [] }));
    } else if (newType === 'series' && episodes.length === 0) {
      setEpisodes([{ title: '', description: '', duration: 45, file: null }]);
    }
  };

  const handleEpisodeChange = (index, field, value) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index][field] = value;
    setEpisodes(updatedEpisodes);
  };

  const handleEpisodeFileChange = (index, file) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index].file = file;
    setEpisodes(updatedEpisodes);
    
    // Also update files state
    const episodeFiles = updatedEpisodes.map(ep => ep.file).filter(f => f);
    setFiles(prev => ({ ...prev, episodes: episodeFiles }));
  };

  const addEpisode = () => {
    setEpisodes([...episodes, { title: '', description: '', duration: 45, file: null }]);
  };

  const removeEpisode = (index) => {
    if (episodes.length > 1) {
      const updatedEpisodes = episodes.filter((_, i) => i !== index);
      setEpisodes(updatedEpisodes);
      
      const episodeFiles = updatedEpisodes.map(ep => ep.file).filter(f => f);
      setFiles(prev => ({ ...prev, episodes: episodeFiles }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.type === 'movie') {
      if (!files.video || !files.thumbnail) {
        toast.error('Video and thumbnail files are required for movies');
        return;
      }
    } else if (formData.type === 'series') {
      if (!files.thumbnail) {
        toast.error('Thumbnail is required for series');
        return;
      }
      if (episodes.length === 0 || episodes.some(ep => !ep.file || !ep.title)) {
        toast.error('All episodes must have a title and video file');
        return;
      }
    }
    
    if (formData.genres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }

    setLoading(true);
    
    try {
      const uploadData = new FormData();
      
      // Add basic form data
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('type', formData.type);
      uploadData.append('releaseYear', formData.releaseYear.toString());
      uploadData.append('rating', formData.rating);
      uploadData.append('language', formData.language);
      uploadData.append('genre', JSON.stringify(formData.genres));
      
      // Add optional fields
      if (formData.duration) uploadData.append('duration', formData.duration.toString());
      if (formData.imdbRating) uploadData.append('imdbRating', formData.imdbRating.toString());
      if (formData.director) uploadData.append('director', formData.director);
      if (formData.producer) uploadData.append('producer', formData.producer);
      if (formData.tags.trim()) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        uploadData.append('tags', JSON.stringify(tagsArray));
      }
      
      // Add files
      uploadData.append('thumbnail', files.thumbnail);
      if (files.trailer) uploadData.append('trailer', files.trailer);
      
      if (formData.type === 'movie') {
        uploadData.append('video', files.video);
      } else if (formData.type === 'series') {
        uploadData.append('seasonNumber', formData.seasonNumber.toString());
        
        // Add episode data
        const episodeData = episodes.map(ep => ({
          title: ep.title,
          description: ep.description,
          duration: parseInt(ep.duration) || 45
        }));
        uploadData.append('episodeData', JSON.stringify(episodeData));
        
        // Add episode files
        episodes.forEach((episode, index) => {
          if (episode.file) {
            uploadData.append('episodes', episode.file);
          }
        });
      }

      const apiUrl = process.env.REACT_APP_API_URL 
        ? `${process.env.REACT_APP_API_URL}/videos/upload`
        : 'http://localhost:8000/api/videos/upload';

      const response = await axios.post(apiUrl, uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        timeout: 600000, // 10 minutes for large files
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
          // You can add a progress bar here
        }
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/admin');
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to upload video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header />
      <Content>
        <PageHeader>
          <BackButton onClick={() => navigate('/admin')}>
            <FaArrowLeft />
          </BackButton>
          <Title>Upload New Video</Title>
        </PageHeader>

        <Form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            
            <FormRow columns="2fr 1fr">
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter video title"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Type *</Label>
                <Select name="type" value={formData.type} onChange={handleTypeChange}>
                  <option value="movie">Movie</option>
                  <option value="series">TV Series</option>
                  <option value="documentary">Documentary</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a compelling description of your video content..."
                required
              />
            </FormGroup>
          </FormSection>

          <FormSection>
            <SectionTitle>Details</SectionTitle>
            
            <FormRow columns="1fr 1fr 1fr">
              <FormGroup>
                <Label>Release Year *</Label>
                <Input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                />
              </FormGroup>

              <FormGroup>
                <Label>Rating</Label>
                <Select name="rating" value={formData.rating} onChange={handleInputChange}>
                  <option value="G">G - General Audiences</option>
                  <option value="PG">PG - Parental Guidance</option>
                  <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                  <option value="R">R - Restricted</option>
                  <option value="NC-17">NC-17 - Adults Only</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow columns="1fr 1fr 1fr">
              <FormGroup>
                <Label>IMDB Rating</Label>
                <Input
                  type="number"
                  name="imdbRating"
                  value={formData.imdbRating}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  step="0.1"
                  placeholder="e.g., 8.5"
                />
              </FormGroup>

              <FormGroup>
                <Label>Director</Label>
                <Input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  placeholder="Director name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Language</Label>
                <Select name="language" value={formData.language} onChange={handleInputChange}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Genres *</SectionTitle>
            <GenreGrid>
              {genres.map(genre => (
                <GenreItem key={genre}>
                  <input
                    type="checkbox"
                    checked={formData.genres.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  {genre}
                </GenreItem>
              ))}
            </GenreGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>Type & Episodes</SectionTitle>
            
            <FormRow columns="1fr 1fr">
              <FormGroup>
                <Label>Type *</Label>
                <Select name="type" value={formData.type} onChange={handleTypeChange}>
                  <option value="movie">Movie</option>
                  <option value="series">TV Series</option>
                  <option value="documentary">Documentary</option>
                </Select>
              </FormGroup>
              
              {formData.type === 'series' && (
                <FormGroup>
                  <Label>Season Number</Label>
                  <Input
                    type="number"
                    name="seasonNumber"
                    value={formData.seasonNumber}
                    onChange={handleInputChange}
                    min="1"
                  />
                </FormGroup>
              )}
            </FormRow>

            {formData.type === 'series' && (
              <div>
                <h4 style={{ color: 'white', marginBottom: '1rem' }}>Episodes</h4>
                {episodes.map((episode, index) => (
                  <div key={index} style={{ 
                    border: '1px solid #333', 
                    padding: '1rem', 
                    marginBottom: '1rem', 
                    borderRadius: '8px' 
                  }}>
                    <FormRow columns="2fr 1fr">
                      <FormGroup>
                        <Label>Episode {index + 1} Title *</Label>
                        <Input
                          type="text"
                          value={episode.title}
                          onChange={(e) => handleEpisodeChange(index, 'title', e.target.value)}
                          placeholder="Episode title"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={episode.duration}
                          onChange={(e) => handleEpisodeChange(index, 'duration', e.target.value)}
                          min="1"
                        />
                      </FormGroup>
                    </FormRow>
                    
                    <FormGroup>
                      <Label>Episode Description</Label>
                      <TextArea
                        value={episode.description}
                        onChange={(e) => handleEpisodeChange(index, 'description', e.target.value)}
                        placeholder="Episode description"
                        rows={3}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Episode Video File *</Label>
                      <FileUploadArea onClick={() => document.getElementById(`episode-${index}`).click()}>
                        <input
                          id={`episode-${index}`}
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleEpisodeFileChange(index, e.target.files[0])}
                        />
                        <FaVideo className="upload-icon" />
                        <div className="upload-text">Upload Episode {index + 1}</div>
                        {episode.file && <div className="file-info">{episode.file.name}</div>}
                      </FileUploadArea>
                    </FormGroup>
                    
                    {episodes.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeEpisode(index)}
                        style={{ 
                          background: '#dc3545', 
                          color: 'white', 
                          border: 'none', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove Episode
                      </button>
                    )}
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addEpisode}
                  style={{ 
                    background: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '2rem'
                  }}
                >
                  Add Another Episode
                </button>
              </div>
            )}
          </FormSection>

          <FormSection>
            <SectionTitle>File Uploads</SectionTitle>
            
            <FormRow>
              <FormGroup>
                <Label>Thumbnail Image *</Label>
                <FileUploadArea 
                  isDragOver={dragOver.thumbnail}
                  onClick={() => document.getElementById('thumbnail-input').click()}
                  onDragOver={(e) => handleDragOver(e, 'thumbnail')}
                  onDragLeave={(e) => handleDragLeave(e, 'thumbnail')}
                  onDrop={(e) => handleDrop(e, 'thumbnail')}
                >
                  <input
                    id="thumbnail-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('thumbnail', e.target.files[0])}
                  />
                  <FaImage className="upload-icon" />
                  <div className="upload-text">Upload Thumbnail</div>
                  <div className="upload-hint">JPG, PNG (Max 5MB)</div>
                  {files.thumbnail && (
                    <div className="file-info">
                      <FaImage />
                      {files.thumbnail.name}
                    </div>
                  )}
                </FileUploadArea>
              </FormGroup>
            </FormRow>

            <FormRow columns="1fr 1fr">
              {formData.type === 'movie' && (
                <FormGroup>
                  <Label>Movie Video File *</Label>
                  <FileUploadArea 
                    isDragOver={dragOver.video}
                    onClick={() => document.getElementById('video-input').click()}
                    onDragOver={(e) => handleDragOver(e, 'video')}
                    onDragLeave={(e) => handleDragLeave(e, 'video')}
                    onDrop={(e) => handleDrop(e, 'video')}
                  >
                    <input
                      id="video-input"
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange('video', e.target.files[0])}
                    />
                    <FaVideo className="upload-icon" />
                    <div className="upload-text">Upload Video File</div>
                    <div className="upload-hint">MP4, AVI, MOV (Max 500MB)</div>
                    {files.video && (
                      <div className="file-info">
                        <FaVideo />
                        {files.video.name}
                      </div>
                    )}
                  </FileUploadArea>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Trailer (Optional)</Label>
                <FileUploadArea 
                  isDragOver={dragOver.trailer}
                  onClick={() => document.getElementById('trailer-input').click()}
                  onDragOver={(e) => handleDragOver(e, 'trailer')}
                  onDragLeave={(e) => handleDragLeave(e, 'trailer')}
                  onDrop={(e) => handleDrop(e, 'trailer')}
                >
                  <input
                    id="trailer-input"
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileChange('trailer', e.target.files[0])}
                  />
                  <FaFilm className="upload-icon" />
                  <div className="upload-text">Upload Trailer</div>
                  <div className="upload-hint">MP4, AVI, MOV (Max 100MB)</div>
                  {files.trailer && (
                    <div className="file-info">
                      <FaFilm />
                      {files.trailer.name}
                    </div>
                  )}
                </FileUploadArea>
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <FormGroup>
              <Label>Tags (comma separated)</Label>
              <Input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., superhero, marvel, action-packed"
              />
            </FormGroup>
          </FormSection>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="loading"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload />
                Upload Video
              </>
            )}
          </SubmitButton>
        </Form>
      </Content>
    </Container>
  );
};

export default VideoUpload;
