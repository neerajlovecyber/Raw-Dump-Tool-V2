import { Box, Container, VStack, Center, HStack, Button, Checkbox } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';

// Import your image
import rdtbigImage from '../assets/rdtbig.png';

function Home() {
  // State to store the selected directory path
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');

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

  useEffect(() => {
    console.log("checked:", checked);
    
    // Reset password when checkbox is unchecked
    if (!checked) {
      setPassword('');
    }
  }, [checked]);

  return (
    <VStack width={"100%"}>
      <Container  width="100%" marginBottom={0} paddingBottom={0}>
        <Box marginTop={10} marginBottom={0} paddingBottom={0}>
          <Center>
            {/* Use imported image */}
            <img src={rdtbigImage} alt="App Icon" style={{ width: "59%", height: "25%" }} />
          </Center>
        </Box>
      </Container>
      <Container  width={"80%"}>
        <p style={{ fontWeight: 500 }}>This is a Python-based Graphical User Interface (GUI) Memory Dumping Forensics Tool, lovingly crafted by Neeraj Singh. The tool is designed to assist digital forensics investigators in the process of extracting, analyzing, and securing volatile memory (RAM) contents. (have used winpmem and 7z inside it)</p>
      </Container>
      <HStack spacing='24px' w="80%">
        <Input 
          value={selectedDirectory}
          width="75%"   
          color='#F64668' 
          _placeholder={{ opacity: 1, color: 'inherit' }} 
          placeholder='Select a Folder' 
          isReadOnly 
        />
        <Button 
          w="170px" 
          style={{ background:"#F64668" }}
          onClick={handleDirectorySelection}
        >
          Select
        </Button>
      </HStack>
      <HStack marginTop="12px" spacing='24px' w="80%">
        <Checkbox
          className="custom-checkbox"
          isChecked={checked}
          onChange={() => setChecked(!checked)}
          style={{ backgroundColor: checked ? '#F64668' : 'transparent' }}
        >
          Encrypt
        </Checkbox>
        <Input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          width="84%"   
          color='#F64668' 
          _placeholder={{ opacity: 1, color: 'inherit' }} 
          placeholder='Enter the Password' 
          isDisabled={!checked} // Disable the input when checkbox is unchecked
          style={{ opacity: checked ? 1 : 0.5 }} // Adjust opacity based on the checked state
        />
      </HStack>
    </VStack>
  );
}

export default Home;
