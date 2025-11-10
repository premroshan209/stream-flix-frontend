import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
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
  max-width: 800px;
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
  font-size: 2rem;
  font-weight: 700;
`;

const Form = styled.form`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #e50914;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
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
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  input {
    margin: 0;
  }
`;

const SaveButton = styled.button`
  background: #e50914;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  
  &:hover {
    background: #f40612;
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const VideoEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [video, setVideo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    releaseYear: new Date().getFullYear(),
    rating: 'PG',
    imdbRating: '',
    director: '',
    producer: '',
    language: 'en',
    genre: [],
    tags: '',
    isActive: true
  });

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 
    'Thriller', 'Documentary', 'Animation', 'Adventure', 'Crime', 'Fantasy'
  ];

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const videoData = response.data.video;
        setVideo(videoData);
        setFormData({
          title: videoData.title || '',
          description: videoData.description || '',
          type: videoData.type || 'movie',
          releaseYear: videoData.releaseYear || new Date().getFullYear(),
          rating: videoData.rating || 'PG',
          imdbRating: videoData.imdbRating || '',
          director: videoData.director || '',
          producer: videoData.producer || '',
          language: videoData.language || 'en',
          genre: videoData.genre || [],
          tags: videoData.tags ? videoData.tags.join(', ') : '',
          isActive: videoData.isActive !== false
        });
      }
    } catch (error) {
      console.error('Error fetching video:', error);
      toast.error('Failed to load video details');
      navigate('/admin/content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await axios.put(`http://localhost:8000/api/admin/videos/${id}`, updateData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Video updated successfully!');
        navigate('/admin/content');
      } else {
        throw new Error(response.data.message || 'Failed to update video');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Content>
          <div style={{ textAlign: 'center', padding: '3rem', color: '#ccc' }}>
            Loading video details...
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Content>
        <PageHeader>
          <BackButton onClick={() => navigate('/admin/content')}>
            <FaArrowLeft />
          </BackButton>
          <Title>Edit Video: {video?.title}</Title>
        </PageHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title *</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description *</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Type</Label>
            <Select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="movie">Movie</option>
              <option value="series">TV Series</option>
              <option value="documentary">Documentary</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Genre</Label>
            <CheckboxGroup>
              {genres.map(genre => (
                <CheckboxItem key={genre}>
                  <input
                    type="checkbox"
                    checked={formData.genre.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                  />
                  {genre}
                </CheckboxItem>
              ))}
            </CheckboxGroup>
          </FormGroup>

          <FormGroup>
            <Label>Release Year</Label>
            <Input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear() + 5}
            />
          </FormGroup>

          <FormGroup>
            <Label>Rating</Label>
            <Select name="rating" value={formData.rating} onChange={handleInputChange}>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="PG-13">PG-13</option>
              <option value="R">R</option>
              <option value="NC-17">NC-17</option>
            </Select>
          </FormGroup>

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
            />
          </FormGroup>

          <FormGroup>
            <Label>Director</Label>
            <Input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Producer</Label>
            <Input
              type="text"
              name="producer"
              value={formData.producer}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Tags (comma separated)</Label>
            <Input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="action, thriller, blockbuster"
            />
          </FormGroup>

          <FormGroup>
            <CheckboxItem>
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              Active (visible to users)
            </CheckboxItem>
          </FormGroup>

          <SaveButton type="submit" disabled={saving}>
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </SaveButton>
        </Form>
      </Content>
    </Container>
  );
};

export default VideoEdit;
