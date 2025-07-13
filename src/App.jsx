import React, { useState, useMemo } from "react";
import SignUpForm from './components/SignUpForm.jsx';
import SignInForm from './components/SignInForm.jsx';
import NavBar from './components/NavBar.jsx';
import NewNavBar from "./components/NewNavBar.jsx";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";

function App() {

  const [themeMode, setThemeMode] = useState('light');

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
    },
  }), [themeMode]);

  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
    //   <NewNavBar theme={themeMode} toggleTheme={toggleTheme} />



    //   <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)'}}>
    //       <SignUpForm/>
    //   </div>
    // </ThemeProvider>

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NewNavBar theme={themeMode} toggleTheme={toggleTheme} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)'}}>
           <SignUpForm/>
      </div>
    </ThemeProvider>
  );


  // return (
  //   <Fragment>
  //     <NavBar></NavBar>
  //     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)'}}>
  //       <SignUpForm/>
  //     </div>
  //   </Fragment> 
  // );
}

export default App;
