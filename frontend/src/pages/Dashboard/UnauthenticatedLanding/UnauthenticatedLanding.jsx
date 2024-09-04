import React from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const BackgroundVideo = ({ src }) => {
  return (
    <VideoContainer>
      <StyledVideo src={src} autoPlay muted loop>
      </StyledVideo>
    </VideoContainer>
  );
};
  
const UnauthenticatedLanding = () => {

  const navigate = useNavigate();

  const reroute = () => {
    navigate('/auth');
  };

  return (
    <>
        <BackgroundVideo src="auth_vid.mp4"/>
        <h1 style={{ position: 'fixed', top: '50%', left: '50%', 
                     transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
            Welcome to imörs
        </h1>
        
        <StartButton style={{ position: 'fixed', top: '55%', left: '50%', 
                     transform: 'translate(-50%, -50%)', textAlign: 'center'
                     }} onClick = {reroute}>
            Start Generating
        </StartButton>
    
    </>
  );
}

// Cringe styling
const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;  // background vid
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 50%; // Center the video horizontally
  transform: translateX(-50%) scale(1.2);
  min-width: 100%;
  min-height: 120%; // scale b/c there is a watermark so we hide it
`;

const StartButton = styled.button`
  background-color: #007BFF; // Nice blue color
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 20px;
  border-radius: 5px;
  outline: none;
  position: relative; // Necessary for z-index to work
  z-index: 10; // Same as the message to ensure visibility
  &:hover {
    background-color: #0056b3;
  }
`;

export default UnauthenticatedLanding;
