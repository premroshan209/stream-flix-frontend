import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaUser, FaCrown, FaEdit, FaSave, FaTimes, FaCalendar } from 'react-icons/fa';
import Header from '../components/Header/Header';
import { loadUser } from '../store/slices/authSlice';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  background: #141414;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 6rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #ccc;
  font-size: 1.1rem;
`;

const SectionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProfileSection = styled(Section)`
  grid-column: 1 / -1;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: ${props => props.src ? `url(${props.src})` : '#333'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  border: 3px solid #e50914;
`;

const ProfileInfo = styled.div`
  flex: 1;
  
  .name {
    color: white;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .email {
    color: #ccc;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  
  .member-since {
    color: #999;
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: white;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
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
  
  &:disabled {
    background: #222;
    color: #888;
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
  
  option {
    background: #333;
  }
`;

const GenresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const GenreChip = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.selected ? '#e50914' : '#555'};
  background: ${props => props.selected ? '#e50914' : 'transparent'};
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #e50914;
    background: ${props => props.selected ? '#f40612' : 'rgba(229, 9, 20, 0.1)'};
  }
`;

const SubscriptionCard = styled.div`
  background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
  border: 2px solid #e50914;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  
  .plan-badge {
    position: absolute;
    top: -10px;
    right: 20px;
    background: #e50914;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`;

const SubscriptionDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SubscriptionDetail = styled.div`
  text-align: center;
  
  .label {
    color: #999;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    text-transform: uppercase;
  }
  
  .value {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? 'transparent' : '#e50914'};
  border: ${props => props.variant === 'secondary' ? '1px solid #555' : 'none'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.variant === 'secondary' ? '#333' : '#f40612'};
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const AccountSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    preferredGenres: []
  });

  useEffect(() => {
    if (user) {
      const profile = user.profiles?.[0] || {};
      setFormData({
        name: user.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        preferredGenres: profile.preferences?.genres || []
      });
    }
  }, [user]);

  const genres = [
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 
    'Thriller', 'Documentary', 'Animation', 'Adventure', 'Crime', 'Fantasy'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      preferredGenres: prev.preferredGenres.includes(genre)
        ? prev.preferredGenres.filter(g => g !== genre)
        : [...prev.preferredGenres, genre]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put('/api/users/profile', {
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender,
        preferences: {
          genres: formData.preferredGenres
        }
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        dispatch(loadUser());
        setEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const subscription = user?.subscription;
  const subscriptionPlan = subscription?.planId;

  return (
    <Container>
      <Header />
      <Content>
        <PageHeader>
          <Title>Account Settings</Title>
          <Subtitle>Manage your profile and subscription preferences</Subtitle>
        </PageHeader>

        <ProfileSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionTitle>
            <FaUser />
            Profile Information
          </SectionTitle>
          
          <ProfileHeader>
            <Avatar src={user?.profiles?.[0]?.avatar}>
              {!user?.profiles?.[0]?.avatar && user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            
            <ProfileInfo>
              <div className="name">{user?.name}</div>
              <div className="email">{user?.email}</div>
              <div className="member-since">
                Member since {new Date(user?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}
              </div>
            </ProfileInfo>
            
            <div>
              {!editing ? (
                <Button onClick={() => setEditing(true)}>
                  <FaEdit />
                  Edit Profile
                </Button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button onClick={handleSave} disabled={loading}>
                    <FaSave />
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setEditing(false);
                      // Reset form data
                      const profile = user.profiles?.[0] || {};
                      setFormData({
                        name: user.name || '',
                        age: profile.age || '',
                        gender: profile.gender || '',
                        preferredGenres: profile.preferences?.genres || []
                      });
                    }}
                  >
                    <FaTimes />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </ProfileHeader>

          {/* Subscription Information */}
          {subscription && subscriptionPlan && (
            <SubscriptionCard>
              <div className="plan-badge">
                <FaCrown />
                {subscriptionPlan.type} Plan
              </div>
              
              <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>
                Current Subscription: {subscriptionPlan.name}
              </h4>
              
              <SubscriptionDetails>
                <SubscriptionDetail>
                  <div className="label">Status</div>
                  <div className="value" style={{ color: subscription.status === 'active' ? '#4CAF50' : '#ff9800' }}>
                    {subscription.status}
                  </div>
                </SubscriptionDetail>
                
                <SubscriptionDetail>
                  <div className="label">Started</div>
                  <div className="value">
                    {new Date(subscription.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </SubscriptionDetail>
                
                <SubscriptionDetail>
                  <div className="label">
                    {subscription.status === 'cancelled' ? 'Access Until' : 'Next Billing'}
                  </div>
                  <div className="value">
                    {new Date(subscription.endDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </SubscriptionDetail>
                
                <SubscriptionDetail>
                  <div className="label">Price</div>
                  <div className="value">₹{subscriptionPlan.price}/{subscriptionPlan.billing}</div>
                </SubscriptionDetail>
                
                <SubscriptionDetail>
                  <div className="label">Quality</div>
                  <div className="value">{subscriptionPlan.videoQuality}</div>
                </SubscriptionDetail>
                
                <SubscriptionDetail>
                  <div className="label">Devices</div>
                  <div className="value">{subscriptionPlan.simultaneousStreams}</div>
                </SubscriptionDetail>
              </SubscriptionDetails>
            </SubscriptionCard>
          )}
        </ProfileSection>

        <SectionsContainer>
          {/* Personal Information */}
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionTitle>
              <FaUser />
              Personal Details
            </SectionTitle>
            
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Age</Label>
              <Input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                disabled={!editing}
                min="13"
                max="100"
                placeholder="Enter your age"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Gender</Label>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!editing}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </Select>
            </FormGroup>
          </Section>

          {/* Preferences */}
          <Section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <SectionTitle>
              <FaCalendar />
              Content Preferences
            </SectionTitle>
            
            <FormGroup>
              <Label>Favorite Genres</Label>
              <p style={{ color: '#999', fontSize: '0.9rem', margin: '0.5rem 0' }}>
                {editing ? 'Click to select your preferred genres' : 'Your selected genres help us recommend better content'}
              </p>
              <GenresGrid>
                {genres.map(genre => (
                  <GenreChip
                    key={genre}
                    selected={formData.preferredGenres.includes(genre)}
                    onClick={() => editing && handleGenreToggle(genre)}
                    disabled={!editing}
                    type="button"
                  >
                    {genre}
                  </GenreChip>
                ))}
              </GenresGrid>
            </FormGroup>
          </Section>
        </SectionsContainer>
      </Content>
    </Container>
  );
};

export default AccountSettings;
