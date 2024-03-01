import { Box, VStack, Button, Flex } from "@chakra-ui/react";
import { ChatIcon, LockIcon, StarIcon, InfoIcon } from '@chakra-ui/icons';
import { useEffect } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Componetes/Home";
import Info from "./Componetes/Info";
import Security from "./Componetes/Security";
import Contact from "./Componetes/Contact";

function App() {
  useEffect(() => {
    // Resetting body margin
    document.body.style.margin = "0";
  }, []);

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

  return (
    <Flex h="100vh" overflow="hidden" borderRadius={"0px"}>
      {/* Sidebar */}
      
        <Box bg="gray.200" w="20%" padding="10px" borderRight="5px solid #4a538a" display="flex" flexDirection="column">
          {/* App Logo and Name */}
          <VStack spacing={5} align="center" marginBottom={30}>
            <Box borderRadius="full" overflow="hidden" boxShadow="lg">
              <img src="src\assets\rdt.png" alt="App Icon" style={{  width:"100%",height: "100%" }} />
            </Box>
          </VStack>

          {/* Menu Buttons */}
          <VStack spacing={5} align="flex" className="sidebar-bottom" w={"100%"}>
            <VStack>
              {/* Use onClick handlers for navigation */}
              <Button w={"100%"} leftIcon={<StarIcon />} variant="ghost" onClick={handleHomeClick}>Home</Button>
              <Button w={"100%"} leftIcon={<LockIcon />} variant="ghost" onClick={handleSecurityClick}>Security</Button>
              <Button w={"100%"} leftIcon={<ChatIcon />} variant="ghost"onClick={handleContactClick}>Contact</Button>
            </VStack>
            <Button leftIcon={<InfoIcon />} variant="ghost" onClick={handleInfoClick}>Information</Button>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex="1" bg="#41436a" boxSizing="border-box" overflowY="auto">
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/security" element={<Security />} />
            <Route path="/Contact" element={<Contact />} />
            <Route index={true} element={<Home />} />
          </Routes>
          </BrowserRouter>
        </Box>
      
    </Flex>
  );
}

export default App;
