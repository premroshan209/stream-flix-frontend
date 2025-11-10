import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { createProfile, updateProfile, deleteProfile } from '../store/slices/profileSlice';
import styled from 'styled-components';

const ProfilesContainer = styled.div`
  min-height: 100vh;
  background: #141414;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Logo = styled.h1`
  color: #e50914;
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ProfilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  max-width: 800px;
  width: 100%;
`;

const ProfileCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  
  &:hover .profile-actions {
    opacity: 1;
  }
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background: ${props => props.avatar ? `url(${props.avatar})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileName = styled.h3`
  font-size: 1.2rem;
  text-align: center;
  color: #ccc;
`;

const ProfileActions = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  button {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #e50914;
    }
  }
`;

const AddProfileCard = styled(ProfileCard)`
  .add-icon {
    border: 2px dashed #666;
    color: #666;
    
    &:hover {
      border-color: #e50914;
      color: #e50914;
    }
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
`;

const Profiles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', avatar: null });

  const handleProfileSelect = (profileId) => {
    navigate(`/home/${profileId}`);
  };

  const handleCreateProfile = () => {
    setEditingProfile(null);
    setProfileData({ name: '', avatar: null });
    setShowModal(true);
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setProfileData({ name: profile.name, avatar: profile.avatar });
    setShowModal(true);
  };

  const handleDeleteProfile = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await dispatch(deleteProfile(profileId));
        toast.success('Profile deleted successfully');
      } catch (error) {
        toast.error('Failed to delete profile');
      }
    }
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      toast.error('Profile name is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      if (profileData.avatar) {
        formData.append('avatar', profileData.avatar);
      }

      if (editingProfile) {
        await dispatch(updateProfile({ profileId: editingProfile._id, profileData: formData }));
        toast.success('Profile updated successfully');
      } else {
        await dispatch(createProfile(profileData));
        toast.success('Profile created successfully');
      }
      
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  return (
    <ProfilesContainer>
      <Header>
        <Logo>StreamFlix</Logo>
        <Title>Who's watching?</Title>
      </Header>

      <ProfilesGrid>
        {user?.profiles?.map((profile) => (
          <ProfileCard
            key={profile._id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleProfileSelect(profile._id)}
          >
            <ProfileAvatar avatar={profile.avatar}>
              {!profile.avatar && profile.name.charAt(0).toUpperCase()}
            </ProfileAvatar>
            <ProfileName>{profile.name}</ProfileName>
            
            <ProfileActions className="profile-actions">
              <button onClick={(e) => { e.stopPropagation(); handleEditProfile(profile); }}>
                <FaEdit />
              </button>
              {user.profiles.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); handleDeleteProfile(profile._id); }}>
                  <FaTrash />
                </button>
              )}
            </ProfileActions>
          </ProfileCard>
        ))}

        {user?.profiles?.length < 5 && (
          <AddProfileCard onClick={handleCreateProfile}>
            <ProfileAvatar className="add-icon">
              <FaPlus />
            </ProfileAvatar>
            <ProfileName>Add Profile</ProfileName>
          </AddProfileCard>
        )}
      </ProfilesGrid>

      {showModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editingProfile ? 'Edit Profile' : 'Create Profile'}</h3>
            <form onSubmit={handleSubmitProfile}>
              <input
                type="text"
                placeholder="Profile Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.files[0] })}
              />
              <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      )}
    </ProfilesContainer>
  );
};

export default Profiles;
