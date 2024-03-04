import { Box, VStack, Button, Flex } from "@chakra-ui/react";
import { ChatIcon, LockIcon, StarIcon, InfoIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./Componetes/Home";
import Info from "./Componetes/Info";
import Security from "./Componetes/Security";
import Contact from "./Componetes/Contact";
import rdtimg from '../src/assets/rdt.png';

function NavLinks() {
  const handleHomeClick = () => {
    window.location.href = "/home"; // Navigate to the Home route
  };

  const handleInfoClick = () => {
    window.location.href = "/info"; // Navigate to the Info route
  };

  const handleSecurityClick = () => {
    window.location.href = "/security"; // Navigate to the Home route
  };

  const handleContactClick = () => {
    window.location.href = "/contact"; // Navigate to the Info route
  };

  const location = useLocation();
  const [currentPath, setCurrentPath] = useState('/home');

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    console.log(currentPath);
    // You can perform additional actions here when currentPath changes
  }, [currentPath]);


  useEffect(() => {
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
      homeButton.classList.add('active');
    }
  }, []);


  useEffect(() => {
    const button = document.querySelector(`[href='${currentPath}']`);
    if (button) {
      button.classList.add('active');
    }
  }, []);

  return (
    <VStack spacing={5} align="flex" className="sidebar-bottom" w={"100%"}>
      <VStack>
        {/* Use onClick handlers for navigation */}
        <Button w={"100%"} id="homeButton" leftIcon={<StarIcon />} variant="ghost" className={currentPath === "/home" ? "active" : ""} onClick={handleHomeClick}>Home</Button>
        <Button w={"100%"} leftIcon={<LockIcon />} variant="ghost" className={currentPath === "/security" ? "active" : ""} onClick={handleSecurityClick}>Security</Button>
        <Button w={"100%"} leftIcon={<ChatIcon />} variant="ghost" className={currentPath === "/contact" ? "active" : ""} onClick={handleContactClick}>Contact</Button>
      </VStack>
      <Button w={"100%"} leftIcon={<InfoIcon />} variant="ghost" className={currentPath === "/info" ? "active" : ""} onClick={handleInfoClick}>Info</Button>
    </VStack>
  );
}

function App() {
  useEffect(() => {
    // Resetting body margin
    document.body.style.margin = "0";
  }, []);

  return (
    <BrowserRouter>
      <Flex h="100vh" overflow="hidden" borderRadius={"0px"}>
        {/* Sidebar */}
        <Box bg="gray.200" w="20%" padding="10px" borderRight="5px solid #4a538a" display="flex" flexDirection="column">
          {/* App Logo and Name */}
          <VStack spacing={5} align="center" marginBottom={30}>
            <Box borderRadius="full" overflow="hidden" boxShadow="lg">
              <img src={rdtimg} alt="App Icon" style={{  width:"100%",height: "100%" }} />
            </Box>
          </VStack>
          {/* Menu Buttons */}
          <NavLinks />
        </Box>
        {/* Main Content */}
        <Box flex="1" bg="#41436a" boxSizing="border-box" overflowY="auto" className="spbutton">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/security" element={<Security />} />
            <Route path="/contact" element={<Contact />} />
            <Route index={true} element={<Home />} />
          </Routes>
        </Box>
      </Flex>
    </BrowserRouter>
  );
}

export default App;
