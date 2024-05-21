import { useState, useEffect } from 'react';
import { Box, Container, VStack, Center, HStack, Button, Textarea} from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';
import { appDir } from '@tauri-apps/api/path';
import { invoke } from '@tauri-apps/api/tauri';
import { open as urlopen } from '@tauri-apps/api/shell' ;
import { useToast } from '@chakra-ui/react';
import { listen } from '@tauri-apps/api/event'; // Import listen API
import { desktopDir } from '@tauri-apps/api/path';
// Import your image
import rdtbigImage from '../assets/rdtbig.png';
import logo from '../../src-tauri/icons/Square30x30Logo.png';
import "../styles.css";
import { ChakraProvider } from '@chakra-ui/react'
function Home() {
  const [selectedDirectory, setSelectedDirectory] = useState('');
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [isWinpmemExecuting, setIsWinpmemExecuting] = useState(false);
  const [unlistenStdout, setUnlistenStdout] = useState(null); // Define unlistenStdout state variable
  const toast = useToast();
  useEffect(() => {
    if (output.includes('96')) {
      toast({
        title: "Process Finished.",
        description: "Memory dumped successfully! at " + selectedDirectory + "/dump.raw",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [output, toast]);
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

  return (<ChakraProvider resetCSS={false}>
    <VStack width={"100%"} className='body dragon' height={"100%"} >

      <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-1 px-1  shadow sm:items-baseline w-full">
  <div className="mb-2 sm:mb-0">
  <img src={logo} alt="App Icon" width={40} height={40}/>
   
  </div>
  <div className="flex space-x-1">
    
  <Button className="hover-effect" style={{all: 'unset'}} onClick={() => urlopen("https://github.com/neerajlovecyber/") }>   <svg className="hover-effect" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 72 72" >
      <circle cx="36"  cy={"36"} r="28" fill='white'
                     />
<path d="M36,12c13.255,0,24,10.745,24,24c0,10.656-6.948,19.685-16.559,22.818c0.003-0.009,0.007-0.022,0.007-0.022	s-1.62-0.759-1.586-2.114c0.038-1.491,0-4.971,0-6.248c0-2.193-1.388-3.747-1.388-3.747s10.884,0.122,10.884-11.491	c0-4.481-2.342-6.812-2.342-6.812s1.23-4.784-0.426-6.812c-1.856-0.2-5.18,1.774-6.6,2.697c0,0-2.25-0.922-5.991-0.922	c-3.742,0-5.991,0.922-5.991,0.922c-1.419-0.922-4.744-2.897-6.6-2.697c-1.656,2.029-0.426,6.812-0.426,6.812	s-2.342,2.332-2.342,6.812c0,11.613,10.884,11.491,10.884,11.491s-1.097,1.239-1.336,3.061c-0.76,0.258-1.877,0.576-2.78,0.576	c-2.362,0-4.159-2.296-4.817-3.358c-0.649-1.048-1.98-1.927-3.221-1.927c-0.817,0-1.216,0.409-1.216,0.876s1.146,0.793,1.902,1.659	c1.594,1.826,1.565,5.933,7.245,5.933c0.617,0,1.876-0.152,2.823-0.279c-0.006,1.293-0.007,2.657,0.013,3.454	c0.034,1.355-1.586,2.114-1.586,2.114s0.004,0.013,0.007,0.022C18.948,55.685,12,46.656,12,36C12,22.745,22.745,12,36,12z"></path>

</svg></Button>
<Button className="hover-effect" style={{all: 'unset'}} onClick={() => urlopen("https://neerajlovecyber.com/") }><img className="hover-effect" width={40} height={40} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAOf0lEQVR4nO1ZZ1SVZ7ZmZSb3x/yY2FFBaSIiNqQXQcVOscWo0STOJLmZNTFek2isFKULIlWagKBYQOmIYk+clDtJZhL1xko/hdP7Vw743PW+3+FAMrMuOjq5f9xr7bW+834v5zzP/p69370/bGxe2kt7ac9t66rwmzcv8UErm0ylK2r198OqNMbQ06r+kJMqBFcoEVSu6A88rjIGHdfcn1ehL1lQwQfGxuIVm/9v23ITkzZfN6evaTFpltfpsOi8Ggur1VhwVoXQ00rMq1Qi6IQCgccV8C+Vw/eYDN5FxOUIKNFqgsuZtNATRvtfHfgfPsfY926ZCzddZcyRzXosa9BiSZ0GS2q1CDsnEFhcrcXKeg6RNRzmV2rgXyaHb4kMPsVyeBX0wvOoFJ55MvgX68xBpWy+VyHG/Crg//RN35sffGVWbrxuQkSLDiuadSAk1l1kENFooASWntfi9WYeqxt5rKznEVnLY16FmhIIOq5GaIUR3oUKzM6VYma2BHOPquFfzCr8CrkN/zbg//ktXt363+biP3/Th403GERd0iOyRYd1l014+7oZG1s5LK7RUAJrmzlKYM0QAsuqWfiWkicgw8JKBgtPcvA/psXMHClmZEowO0cBvyIWPgVsgVchXn3R4H+37du+C1u/7cObNxmsuqzHqlYD3rrB4Q83zXjnuhmrmg2UQHi9Hm+0mK0EVlkIhJ8nT0FDCQSWarCwksP8ExwCSo2YkSXF9AwxZmYq4FPAYW4e1+xViN+9KPCvfvjXvgtb/9qHt79gKfjVlw3Y8gWHd78wWwksq9dSAutauJ8RWDmEwOIzjJDEhXL6BOaf4BBSzsGv2AiPDCmmpYkwM0sNr6McZueyl6fH4j+em8AHXwuyefdLHisv6xHVqsc7n/N475YZf/zcjC03zdhwhcWSWg2W1Wqx4ZKZElj7ixwgBJZV8/A7psTcgl7MO27E/AoO845zCCrl4J1voASmpoowK9uAObksZmax+c8F/r1bfZs++LIPxFe3GqjmN1xj8P5fzIPRv2HGqguCfKIajVh/0Yx1F8xY28RjdQOPlXU8Imp4rDjHY1kVj3nlOkrAr5gkM2clEHCMw+xsFVxTezA1leQEg1nZLDyOcOv/JfBrmhjnFY3a/hVNWlppwoc4WVveqKXlc2mdBotrNb84A1QIqVQimJwB5QoElMnhVyKn+vcq7MXc/F7MyZNiVo4EM7Ik8Dgihnu6GG6HRHBN6YFLUg+cE7rheLALDnFdT5wPylyfmUBkk+HHpfUaCnI58cZBJ2tE8wT8Egt4Wv+rVJh/RoWQU0rMO6lEUIXlECNnwDEZfIpkljOgl5bQWdkSWoFIAk9LF/2MgFN8NxwOdGFybBecDkj+/kzgN12H/TvXeW7LDTPeuMxQoBFNOioZskZk8/Y1M966asa6i6y19gvJa8aaIfKJHCKfJWd5LDrNW8+AwBIDgss4BJaQRObgU8jBK5+Da4qEEpiWrsH0IyzcDjOcc4pp8tMTuGxOIeAIyIgGPdX36xcZWm0o8GtmbL5qxqYrZqxuYrCwSoXltbpB7VuSN6qWR8T5IQTO8Ag7xcO3SE3l41ess+rfr4ijJZRUoOkZGjge7IZzIimvLKals3BNZZKfCjxpsja28t2bLpux8TJPo0sksvkKT0FvviIAf5PcbzUjvM5AZRNea6SVZ6D2Rw1J3uXVPJae5bH4NI+wSh4BxVp6AnvlqxFYSg40Dr5FHLzJGUBKaI5pQP9wP2yCWzqLKalsj00VfjMsgXUtfAAphRsvmbG6maG6XlajpYCptwrAyR5ScZac1yP0lBIRdSYB/IB0LKWTgrdEf9Epntb/wBI9ZmZJMCdP8Q/y8cwjBFg4J0owKbYLrilauKWRJ8DCKYX3HZ5AM7939XklVp2VYnFFJ4JKOhBZb8TrdSqsrpJSX1uronpfVa3AvGNt8C94iGUnerCiUoLwSrnQOpxUYnGZBGElEiwsU1LthxyTIfioGL7ZXXBPvAuPpHvwzZFR+czNVGB2mhgzU0XwOCSHa6oS9rvuYPLeB3CJE8H5gAzOKezuYQmsbeJros5IIdWbQWxLdTsia7V4v0GKAXuvXoo19UZsb+mln8VaDhLL/g8behFeZcTmKol1//pKCRaeMOLdauE7xFoePWqOXm8+KYXPUQPCCwf3L84Vwy1ZgeUZ/0M/d6vMcIwRwzGJqR6WwKoG/k7UOQ1aH+npH6dcEyHynAqZXyqsP3DkLwqsPKdB7lfCWsNdFS7e19HrzFsKLK3UIO3G4P7kqwqElqqRdt2y/44W578XrpNaFfDKViOmWW7dv7dBDrdkGXZXt9PP1d/p4HRQBYdE5sdhCUTVccqoGiMO3xJ+oP6OCitOSXD1sZ5GmfiVR3qEn+rFpQcCydhLPTh0UwDQck+HRWW9aL2vh1hrpn7xnh7BBVI03RVIxl2UYVdNB72u+1EHz8NSNN7Wo0fNo1vNo+4HHVzjRTjztYzu2XFeBqcEPRwSWfmwBCJqOC6ihsXb54VH+lDOYGlZJ+TGPly4r0PLfR0Uxj4sKe1Cu0qQQXjpA2w6K+xvU3JYUNgFuaEPjXd11Ml1QHYnHiuE/VElYoRm/CR8v4zDrJRO9OrMqP5ei3Pfa+m1a0w77olNdE9wuhhOiSZMjjexwxJYcY7jSPVYWi6FSMOh/wnw59oeQQo35Ei+LkT6TzU99B7ZMzfzAcLKpJDozHTt/SqREOlWGeIuCVF866Rlv9YMn0wxXOLuolvF0rX1pcL376yVYWeNsD8qrwt9/U/QpWDhGC2GYyKLSQefgsCyak5JS98pDepvq+iXXbXkw/ozUrxxWoInAK49MggSu62EZ04HFlSoceEnYd+VB8K9lccliCgV0/2X7gn3Gm7r4J2jxJT4h6j+TpDphbvCvZAsMYIyRHjyBGj8QZDb6a9kcDyggkMCg0kHmeEltPgsf4ccOktPGxHTIkSGRKlDxSOsrJc6uSZrxGKauzEntwcLKvRIvCoAIveIlIKOShGQJ0WbQniSNF9a5Jibq4NLQgd2Vgt50PcEeCTjMC1JgqmJEjzs5dDXL+z/6EQ7HA7qMTmegV2cafgkDjvN15ATc9FpFpHH2qyVoeZHLcIqBK+5rbWuLy98iDm5YoSWG/B6xWAprPq7FkHFGgQWaXD2b4P7w4sk8MzVwyWhE/PS71vXT36jgXuqGm4palR8rbGue8Xdg0O8kUQfE+OeoowurGT3kuOe9ix5PfBIuQvvrDaEFkkQdpKhHlIkQUiBGCH5YszO6KB9TXCZEcFFCgTkiuCfI4JfrhiBx0wIKDbBO0uMuRkieB4WwTNTgTnZBjgldMM59iGmJ/XAPaEHbgliTEszwi3VCOc4Mex23sPoD7+D7c42TIpnYH+AwYQY065hCYSe4P0XnOCw4CSHoDK90LMcFUbAAV9gcTISeuUraUvsX6ynwwnpLoMsHSZp0vyLLY1a4WCv45Gpo83alGQZZmSSoYWF+2GW9jyuh2jfg/F7RBizow0TY9SwF6KP8dFGn2EJ2MTilZByrotMSyHlDAVHPLScoSNg6BAn86x3gZr28175GtpZEifgSYNGehxfS5fpnS+AJ72OW5qS9vquyUoBfIYAfqoFvFOSCWN3tGP0J+2wP2CE3QEG42OYToJteAI2NjbBpVwyiSbx2TlyCtCnQEs/D3USbe8CLZ2mZmcrEWAB7j8A3BJ1Lwt4MueSRm1KkszSqKkHwacJ4F1SWNjFKDH60zaM3SWi0pkYS6LPJNk8rfkWGe0DS1iODtsFOjoteRyRWiM8EGXiPoUGOklNz5BZI+5baOnth0R9APzMLBZO8WLYR3di6iH9P4B3SmIx9rNujPr4McbvV1Hp2MaY2FF7jXY2z2IeGbIfyBsC6od+4QPrqSI6hJMx0DW5B1OShXHQJbGbzrQkUR3jrbMtHQ8nxXRS8Hb7OzFhbwfG7+mA7a52jPusHWN3tNHIE/Ajtz/Ga9se4/dbH2HE9u6/2TyreaaZHKamivoJKAKOghwC1OpJQ0APAKegLcDJXBvXhUmxg8An7usQwO8eBD/mn4H/6BF+v7Wtf+yOXhebf8W8j3IbiIa981lMTZFQkB4ZSqprkpReFndPV1DQ7ukqq1SIk9ciRDIemSydbYnenRIUmLCnA5PjZD+TDWkVxu/ppeBHftyJ8TEmkrgYu8+0zuZ5bG4eW0B0PCvLQEESn5mpJ6//qLaJzziip5F2ThALoC3AB0oknWstZXLi/h4adad4HZyTBfAOiSwtlyM/FiI/bp+Wgh+335Rr8yL+eTEnl6klkZ1mKX+OB3sw44jBGmkC2OFAN5XJ9MMGa8QJcFLfyVBOxkLnZD0Fb7u7E07JDBwJ+AQWdrFajNzejte2PcKYz2QD4JtsYvFbmxdh5EXrrGymeVYWCxdaAjsxOZZIRo8Zlkg7J8qovh3jZVQq04YAJ/WdzLR20VKM3dmOCfukVDIOCQwmxmgwwgJ+1CeiAdk0Toh9QS93h5B41eMIm08i65TQS8Ha7++Ec6IC0zMYuKUZMHFvBybs64BrioGWxgHg9HBKNAiH0442TDpoIL09bPfIMXJbG03WUZ+KYBttEmTzoiL/z8w9nVvvfpiVO8bLKVhSTeyjRXBO0mBSbC9sd7fDbr8IU1KEBKVJmsxg3O4ejP6kDba7xZgQrcaoTzpp1Cn4Hb0YF83Injthn9amJWlHux1i85wSNPyEPV1CKSTa3tUp1HMik71iOCQa4ZBgpKAHyqOgdUuJ3NaBMbtV/Lj9phz7WM0om1/bXA8b7VxSjIfsYhTqcbs6aS0f86lQz0m0RxG3AB/xX0KFee2jR3htWwdG7+xVj9tvTH3mE/bfYrF4xSGB958YrSi23S2+N2Znl2HUx+39IwhwCr6tf8T2DsPIT8U/jd4lL7KNNvo9dWP20l7aS7P5v+x/AZGxmysTMSWgAAAAAElFTkSuQmCC"></img></Button>
<Button className="hover-effect" style={{all: 'unset'}} onClick={() => urlopen("https://www.linkedin.com/in/neerajlovecyber/") }>
<svg className="hover-effect" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
<path fill="#0288d1" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path><path fill="#fff" d="M14 19H18V34H14zM15.988 17h-.022C14.772 17 14 16.11 14 14.999 14 13.864 14.796 13 16.011 13c1.217 0 1.966.864 1.989 1.999C18 16.11 17.228 17 15.988 17zM35 24.5c0-3.038-2.462-5.5-5.5-5.5-1.862 0-3.505.928-4.5 2.344V19h-4v15h4v-8c0-1.657 1.343-3 3-3s3 1.343 3 3v8h4C35 34 35 24.921 35 24.5z"></path>
</svg></Button>
  </div>
</nav>
      <Container width="100%" marginBottom={0} paddingBottom={0}>
        <Box marginTop={6} marginBottom={0} paddingBottom={0}>
          <Center>
            <img src={rdtbigImage} alt="App Icon" style={{ width: "59%", minHeight: "25%"}} />
          </Center>
        </Box>
      </Container>
      <Container minWidth={"80%"}>
        <p style={{ fontWeight: 500 }}>This is a Rust & React - based Graphical User Interface (GUI) Memory Dumping Forensics Tool, lovingly crafted by Neeraj Singh. The tool is designed to assist digital forensics investigators in the process of extracting of securing volatile memory (RAM) contents as Dump File. (Based on Winpmem)</p>
      </Container>
      <HStack spacing='14px' w="80%" className='sm:mx-auto pt-2' align='stretch'>
        <Input
          value={selectedDirectory}
          
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
      <HStack marginTop="2px" spacing='14px' w="80%">

      </HStack>
      
      <Button
  w="250px"
  h="40px"
  marginTop={4}
  variant={isWinpmemExecuting ? 'disabled' : 'solid'} // Change variant based on execution state
  onClick={handleDumpMemory}
  disabled={isWinpmemExecuting} // Disable button while winpmem is executing
   style={{ color: '#FFFFFF', cursor: isWinpmemExecuting ? 'not-allowed' : 'pointer' }} // Set text color and cursor style
>
  {isWinpmemExecuting ? (
    <>
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 mr-3 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Dumping...
    </>
  ) : (
    'Dump Memory'
  )}
</Button>
      <Textarea id='output'
        margin={2}
        placeholder='Terminal Output'
        value={output}
        readOnly
        resize={"vertical"}
        height={80}
        maxHeight={"50%"}
        minW={"80%"}
        maxW={"80%"}
      />
    </VStack> </ChakraProvider>
  );
}

export default Home;
