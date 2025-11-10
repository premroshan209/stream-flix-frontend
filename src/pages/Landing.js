import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const LandingContainer = styled.div`
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
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 4rem;
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #e50914;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &.primary {
    background: #e50914;
    color: white;
    
    &:hover {
      background: #f40612;
    }
  }
  
  &.secondary {
    border: 1px solid #fff;
    color: white;
    
    &:hover {
      background: white;
      color: black;
    }
  }
`;

const HeroSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(motion(Link))`
  background: #e50914;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f40612;
    transform: translateY(-2px);
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 2rem;
  background: #000;
`;

const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  opacity: 0.8;
  line-height: 1.6;
`;

const Landing = () => {
  const features = [
    {
      icon: '🎬',
      title: 'Unlimited Movies & Shows',
      description: 'Watch unlimited movies, TV shows, documentaries and more on any device.'
    },
    {
      icon: '📱',
      title: 'Watch Anywhere',
      description: 'Stream on your phone, tablet, laptop, and TV without paying more.'
    },
    {
      icon: '👥',
      title: 'Multiple Profiles',
      description: 'Create profiles for different family members, each with personalized recommendations.'
    },
    {
      icon: '💾',
      title: 'Download & Watch',
      description: 'Download your favorite content and watch offline, anytime, anywhere.'
    }
  ];

  return (
    <LandingContainer>
      <Header>
        <Logo>StreamFlix</Logo>
        <AuthButtons>
          <Button to="/login" className="secondary">Sign In</Button>
          <Button to="/register" className="primary">Start Free Trial</Button>
        </AuthButtons>
      </Header>

      <HeroSection>
        <HeroTitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Unlimited entertainment, one low price.
        </HeroTitle>
        
        <HeroSubtitle
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stream thousands of movies and TV shows. Start your free trial today.
        </HeroSubtitle>
        
        <CTAButton
          to="/register"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Free Trial
        </CTAButton>
      </HeroSection>

      <FeaturesSection>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </LandingContainer>
  );
};

export default Landing;
