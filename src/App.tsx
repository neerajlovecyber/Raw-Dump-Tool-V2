import { Box, VStack, Button, Flex } from "@chakra-ui/react";
import { ChatIcon, LockIcon, StarIcon, InfoIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Info from "./components/Info";
import Security from "./components/Security";

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
    <VStack spacing={5} align="flex" className="sidebar-bottom " w={"100%"}>
      <VStack>
        {/* Use onClick handlers for navigation */}
        <Button w={"100%"} id="homeButton" leftIcon={<StarIcon />} variant="ghost" className={currentPath === "/home" ? "active" : ""} onClick={handleHomeClick}>Home</Button>
        <Button w={"100%"} leftIcon={<LockIcon />} variant="ghost" className={currentPath === "/security" ? "active" : ""} onClick={handleSecurityClick}>Security</Button>
       
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
    <BrowserRouter><div className="">
      <Flex h="100vh" overflow="hidden" borderRadius={"0px"}>
        {/* Sidebar */}
        <Box bg="gray.200" w="20%" padding="10px"  display="flex" flexDirection="column">
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
        <Box flex="1"  boxSizing="border-box" overflowY="auto" className="spbutton">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/security" element={<Security />} />
            
            <Route index={true} element={<Home />} />
          </Routes>
        </Box>
      </Flex></div>
    </BrowserRouter>
  );
}

export default App;
