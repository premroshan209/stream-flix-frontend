import styled from 'styled-components';
import { motion } from 'framer-motion';

export const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 170px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #181818;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

export const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: flex-end;

  button {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid white;
    background: rgba(42, 42, 42, 0.6);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: white;
      color: black;
      transform: scale(1.1);
    }
  }
`;

export const Info = styled.div`
  color: white;

  p {
    font-size: 0.9rem;
    opacity: 0.8;
    margin: 0.25rem 0;
  }
`;

export const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  color: white;
`;
