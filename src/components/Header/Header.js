import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaBell, FaCaretDown, FaUser, FaCog, FaCrown } from 'react-icons/fa';
import { logout } from '../../store/slices/authSlice';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${props => props.$scrolled ? 'rgba(20, 20, 20, 0.95)' : 'transparent'};
  transition: background 0.3s ease;
  backdrop-filter: blur(10px);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: bold;
  color: #e50914;
  text-decoration: none;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ccc;
  }
  
  &.active {
    color: #e50914;
  }
`;

const AdminNavLink = styled(NavLink)`
  background: #e50914;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &:hover {
    background: #f40612;
    color: white;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  width: ${props => props.$expanded ? '300px' : '40px'};
  
  form {
    display: flex;
    align-items: center;
    width: 100%;
  }
  
  input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 0.75rem;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid ${props => props.$expanded ? '#555' : 'transparent'};
    border-radius: 4px;
    color: white;
    font-size: 0.9rem;
    opacity: ${props => props.$expanded ? 1 : 0};
    transition: all 0.3s ease;
    
    &::placeholder {
      color: #888;
    }
    
    &:focus {
      outline: none;
      border-color: #e50914;
    }
  }
`;

const SearchIcon = styled.button`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 1;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: ${props => props.src ? `url(${props.src})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid #333;
  border-radius: 4px;
  min-width: 200px;
  padding: 0.5rem 0;
  z-index: 1000;
  
  display: ${props => props.$visible ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: white;
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Header = ({ profileId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentProfile = user?.profiles?.find(p => p._id === profileId);
  const isAdmin = user?.role === 'admin';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${profileId}?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchIconClick = () => {
    if (searchExpanded && searchQuery.trim()) {
      handleSearch({ preventDefault: () => {} });
    } else {
      setSearchExpanded(!searchExpanded);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <HeaderContainer $scrolled={scrolled}>
      <HeaderContent>
        <Logo to={profileId ? `/home/${profileId}` : '/'}>StreamFlix</Logo>
        
        <Navigation>
          {profileId && (
            <>
              <NavLink to={`/home/${profileId}`}>Home</NavLink>
              <NavLink to={`/browse/${profileId}`}>Browse</NavLink>
            </>
          )}
          <NavLink to="/subscription">Subscription</NavLink>
          {isAdmin && (
            <AdminNavLink to="/admin">Admin Panel</AdminNavLink>
          )}
        </Navigation>
        
        <RightSection>
          <SearchContainer $expanded={searchExpanded}>
            <form onSubmit={handleSearch}>
              <SearchIcon onClick={handleSearchIconClick}>
                <FaSearch />
              </SearchIcon>
              <input
                type="text"
                placeholder="Search movies, shows..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onBlur={() => {
                  setTimeout(() => {
                    if (!searchQuery) setSearchExpanded(false);
                  }, 200);
                }}
              />
            </form>
          </SearchContainer>
          
          <IconButton>
            <FaBell />
          </IconButton>
          
          <ProfileDropdown>
            <ProfileButton onClick={() => setDropdownVisible(!dropdownVisible)}>
              <ProfileAvatar src={currentProfile?.avatar}>
                {!currentProfile?.avatar && currentProfile?.name?.charAt(0).toUpperCase()}
              </ProfileAvatar>
              <FaCaretDown />
            </ProfileButton>
            
            <DropdownMenu $visible={dropdownVisible}>
              <DropdownItem onClick={() => navigate('/profiles')}>
                <FaUser />
                Switch Profile
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/account')}>
                <FaCog />
                Account Settings
              </DropdownItem>
              <DropdownItem onClick={() => navigate('/subscription')}>
                <FaCrown />
                Subscription
              </DropdownItem>
              {isAdmin && (
                <DropdownItem onClick={() => navigate('/admin')}>
                  <FaCog />
                  Admin Dashboard
                </DropdownItem>
              )}
              <DropdownItem onClick={handleLogout}>
                Logout
              </DropdownItem>
            </DropdownMenu>
          </ProfileDropdown>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
