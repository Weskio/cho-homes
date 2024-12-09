import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const SurprisePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading Experience...
        </LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Cursor
        style={{
          transform: `translate(${mousePosition.x - 25}px, ${mousePosition.y - 25}px)`,
        }}
      />
      <Content>
        <Header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to the Surprise
        </Header>
        <Description
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Interactive Digital Experience
        </Description>
        <ProjectsGrid>
          {[1, 2, 3, 4].map((item) => (
            <ProjectCard
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * item }}
            >
              <ProjectTitle>Project {item}</ProjectTitle>
              <ProjectDescription>
                A beautiful description for project {item}
              </ProjectDescription>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: #0f0f0f;
  color: #ffffff;
  cursor: none;
  overflow: hidden;
`;

const Cursor = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  mix-blend-mode: difference;
  z-index: 9999;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px;
`;

const Header = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
`;

const Description = styled(motion.p)`
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 60px;
  opacity: 0.8;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 15px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  opacity: 0.7;
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f0f0f;
`;

const LoadingText = styled(motion.p)`
  color: #ffffff;
  font-size: 1.5rem;
  letter-spacing: 2px;
`;

export default SurprisePage;
