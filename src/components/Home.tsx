import { useState, useEffect } from 'react';
import { Box, Container, VStack, Center, HStack, Button, Textarea } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event'; // Import listen API
import { desktopDir } from '@tauri-apps/api/path';
// Import your image
import rdtbigImage from '../assets/rdtbig.png';

function Home() {
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [isWinpmemExecuting, setIsWinpmemExecuting] = useState(false);
  const [unlistenStdout, setUnlistenStdout] = useState(null); // Define unlistenStdout state variable

  useEffect(() => {
    const loadDataFromLocalStorage = () => {
      const storedSelectedDirectory = localStorage.getItem('selectedDirectory');
      if (storedSelectedDirectory) setSelectedDirectory(storedSelectedDirectory);
      
      const storedChecked = localStorage.getItem('ischecked');
      if (storedChecked) setChecked(JSON.parse(storedChecked));
      
      const storedPassword = localStorage.getItem('password');
      if (storedPassword) setPassword(storedPassword);


 
    }; // Add this closing bracket

    loadDataFromLocalStorage();
  }, []);

  useEffect(() => {
    const storeDataToLocalStorage = () => {
      localStorage.setItem('selectedDirectory', selectedDirectory);
      localStorage.setItem('checked', JSON.stringify(checked));
      localStorage.setItem('password', password);
    
    };

    storeDataToLocalStorage();
  }, [selectedDirectory, checked, password,isWinpmemExecuting]);

  useEffect(() => {
    const unlistenPromise = listen('stdout', (event) => {
      const payload = event.payload as string; // Type assertion
      setOutput((prevOutput) => prevOutput + '\n' + payload); // Accumulate output
      // Check if "Driver Unloaded" is present in the new output

      if (payload.includes("Driver Unloaded")) {
        setIsWinpmemExecuting(false);
      }

    });

    unlistenPromise.then((unlistenFunction) => {
      setUnlistenStdout(() => unlistenFunction);
    });

    return () => {
      unlistenPromise.then((unlistenFunction) => {
        unlistenFunction(); // Call the unlisten function to remove the event listener
      });
    };
  }, []);

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

  const handleDumpMemory = async () => {
    setIsWinpmemExecuting(true);
    try {
      let targetPath;
      if (selectedDirectory) {
        targetPath = selectedDirectory;
      } else {
        targetPath = await desktopDir();
      }
      setIsWinpmemExecuting(true);
      setOutput("Started dumping memory to " + targetPath + "/dump.raw");
      // Invoke the Rust function to launch the external executable
      await invoke('launch_exe', {
        args: [targetPath + "/dump", "--threads", "6"]
      });
    } catch (error) {
      setOutput('Failed to launch exe: ' + error);
    } finally {
      
    }
  };

  useEffect(() => {
    return () => {
      if (typeof unlistenStdout === 'function') {
        unlistenStdout();
      }
    };
  }, [unlistenStdout]);

  return (
    <VStack width={"100%"} className='bodyb' height={"100%"}>
      <Container width="100%" marginBottom={0} paddingBottom={0}>
        <Box marginTop={10} marginBottom={0} paddingBottom={0}>
          <Center>
            <img src={rdtbigImage} alt="App Icon" style={{ width: "59%", height: "25%" }} />
          </Center>
        </Box>
      </Container>
      <Container width={"80%"}>
        <p style={{ fontWeight: 500 }}>This is a Rust & React - based Graphical User Interface (GUI) Memory Dumping Forensics Tool, lovingly crafted by Neeraj Singh. The tool is designed to assist digital forensics investigators in the process of extracting of securing volatile memory (RAM) contents as Dump File. (Based on Winpmem)</p>
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
          backgroundColor={isWinpmemExecuting ? 'grey' : '#F64668'} // Change background color based on execution state
          onClick={handleDirectorySelection}
          disabled={isWinpmemExecuting} // Disable button while winpmem is executing
          style={{ color: '#FFFFFF', cursor: 'pointer' }} // Set text color and cursor style
        >
          Select
        </Button>
      </HStack>
      <HStack marginTop="12px" spacing='24px' w="80%">
        {/* <Checkbox
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
          style={{ opacity: checked ? 1 : 0.5}}
        /> */}
      </HStack>
      <Button
        w="250px" h="40px" marginTop={9}
        variant={isWinpmemExecuting ? 'disabled' : 'solid'} // Change variant based on execution state
        onClick={handleDumpMemory}
        disabled={isWinpmemExecuting} // Disable button while winpmem is executing
        style={{ color: '#FFFFFF', cursor: 'pointer' }} // Set text color and cursor style
      >
        {isWinpmemExecuting ? 'Dumping' : 'Dump Memory'} {/* Change button text based on execution state */}
      </Button>

      <Textarea id='output'
        margin={10}
        placeholder='Terminal Output'
        value={output}
        readOnly
        resize={"vertical"}
        height={80}
        maxHeight={"19%"}
        minW={"80%"}
        maxWidth={"80%"}
      />
    </VStack>
  );
}

export default Home;
