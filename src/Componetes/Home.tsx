import { Box, Container, VStack, Center, HStack, Button, Checkbox,Textarea} from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event'; // Import listen API
import { desktopDir } from '@tauri-apps/api/path';

// Import your image
import rdtbigImage from '../assets/rdtbig.png';

const Home = () => {
  const [output, setOutput] = useState('');
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');

  const [unlistenStdout, setUnlistenStdout] = useState<(() => void) | null>(null);

useEffect(() => {
  // Listen for stdout events
  listen('stdout', (event) => {
    setOutput((output) => output + '\n' + event.payload);
  }).then((unlisten) => {
    setUnlistenStdout(() => unlisten);
  });

  // Return cleanup function to unsubscribe when component unmounts
  return () => {
    if (unlistenStdout) {
      unlistenStdout();
    }
  };
}, []);

// ...

// Call unlistenStdout when needed
if (unlistenStdout) {
  unlistenStdout();
}
  const handleDirectorySelection = async () => {
    const defaultPath = await appDir();
    const selected = await open({
      directory: true,
      multiple: true,
      defaultPath: defaultPath,
    });

    if (Array.isArray(selected)) {
      setSelectedDirectory(selected.join(', '));
    } else if (selected === null) {
      console.log('User cancelled the selection');
    } else {
      setSelectedDirectory(selected);
    }
  };

  return (
    <VStack width={"100%"}>
      <Container  width="100%" marginBottom={0} paddingBottom={0}>
        <Box marginTop={10} marginBottom={0} paddingBottom={0}>
          <Center>
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
          {checked ? 'Encrypted' : 'Encrypt'}
        </Checkbox>
        <Input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          width="84%"   
          color='#F64668' 
          _placeholder={{ opacity: 1, color: 'inherit' }} 
          placeholder='Enter the Password' 
          isDisabled={!checked}
          style={{ opacity: checked ? 1 : 0.5 }}
        />
      </HStack>
      <Button 
        w="250px" h="40px" marginTop={29}
        style={{ background:"#F64668" }}
        onClick={async () => {
          try {
            const desktopPath = await desktopDir();
            // Invoke the Rust function to launch the external executable
            await invoke('launch_exe', { 
              exePath: 'src/assets/winpmem.exe',
              args: [desktopPath+"/dump", "--threads", "6"]
            });
          } catch (error) {
            setOutput('Failed to launch exe: ' + error);
          }
        }}
      >
        Dump Memory
      </Button>

      <Textarea 
        margin={10} 
        placeholder='Terminal Output'  
        value={output} 
        readOnly 
        resize={"none"} 
        height={100} 
        maxHeight={"5%"} 
        minW={"80%"} 
        maxWidth={"80%"}  
      />
    </VStack>
  );
}

export default Home;
