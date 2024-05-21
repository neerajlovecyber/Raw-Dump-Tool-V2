import { Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import Home from "./components/Home";

function App() {
  useEffect(() => {
    // Resetting body margin
    document.body.style.margin = "0";
  }, []);

  return (
    <div className="">
      <Flex h="100vh" overflow="hidden" borderRadius="0px">
        {/* Sidebar */}

        {/* Main Content */}
        <Box flex="1" boxSizing="border-box" overflowY="auto" className="spbutton" padding={"0px"}>
          {/* All your components go here */}
       
          <Home />
          
          
         
        </Box>
      </Flex>
    </div>
  );
}

export default App;
