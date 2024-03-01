


import { Box, Container, VStack, Center, HStack, Button } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useState } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';

function Home() {
  // State to store the selected directory path
  const [selectedDirectory, setSelectedDirectory] = useState('');

  // Function to handle the directory selection
  const handleDirectorySelection = async () => {
    const defaultPath = await appDir();
    const selected = await open({
      directory: true,
      multiple: true,
      defaultPath: defaultPath,
    });

    if (Array.isArray(selected)) {
      // If multiple directories are selected
      setSelectedDirectory(selected.join(', '));
    } else if (selected === null) {
      // If the user cancelled the selection
      console.log('User cancelled the selection');
    } else {
      // If a single directory is selected
      setSelectedDirectory(selected);
    }
  };

  return (
    <VStack width={"100%"}>
             <Container  width="100%" marginBottom={0} paddingBottom={0}>
          <Box marginTop={10} marginBottom={0} paddingBottom={0}>
          <Center>
            <img src="src\assets\rdtbig.png" alt="App Icon" style={{ width: "59%", height: "25%" }} />
            </Center>
          </Box>
        </Container>
        {/* <Container>
      <p style={{ margin: "auto", marginLeft: "35vh" ,fontWeight:'bold', fontSize:"0.9rem"}}> + By NeerajLoveCyber</p>
    </Container> */}
     
      
      <Container  width={"80%"}>
        <p style={{  fontWeight:500}}>This is a Python-based Graphical User Interface (GUI) Memory Dumping Forensics Tool, lovingly crafted by Neeraj Singh. The tool is designed to assist digital forensics investigators in the process of extracting, analyzing, and securing volatile memory (RAM) contents. (have used winpmem and 7z inside it)</p>
      </Container>
      
      <HStack spacing='24px' w="80%">
        <Input 
          value={selectedDirectory} // Display the selected directory in the input field
          width="75%"   
          color='#F64668' 
          _placeholder={{ opacity: 1, color: 'inherit' }} 
          placeholder='Select a Folder' 
          isReadOnly // Make the input field read-only
        />
        <Button 
          w="170px" 
          style={{background:"#F64668"}}
          onClick={handleDirectorySelection} // Call the function on button click
        >
          Select
        </Button>
      </HStack>
      

    </VStack>
  );
}

export default Home;
