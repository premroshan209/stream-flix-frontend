import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { login, clearError } from '../store/slices/authSlice';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #0f0f0f 0%,
    #141414 25%,
    #1a1a1a 50%,
    #141414 75%,
    #0f0f0f 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginForm = styled(motion.form)`
  background: rgba(0, 0, 0, 0.9);
  padding: 3rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  margin: 1rem;
`;

const Logo = styled.div`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  color: #e50914;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    border-color: #e50914;
    outline: none;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #f40612;
  }
  
  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  
  a {
    color: #e50914;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  text-align: center;
  padding: 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 4px;
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const result = await dispatch(login(formData));
      if (result.type === 'auth/login/fulfilled') {
        toast.success('Login successful!');
        navigate('/profiles');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <LoginContainer>
      <LoginForm
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
      >
        <Logo>StreamFlix</Logo>
        <Title>Sign In</Title>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? <div className="loading"></div> : 'Sign In'}
        </Button>

        <LinkText>
          New to StreamFlix? <Link to="/register">Sign up now</Link>
        </LinkText>
        
        <LinkText>
          <Link to="/forgot-password">Forgot password?</Link>
        </LinkText>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
