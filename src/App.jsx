import React, { useState, useMemo } from "react";
import SignUpForm from './components/SignUpForm.jsx';
import SignInForm from './components/SignInForm.jsx';
import { AppBar, Button, Toolbar, Typography, Box, createTheme, CssBaseline, Stack, ThemeProvider} from '@mui/material';
import logo_dark from './assets/smoothie-dark.png';
import logo_light from './assets/smoothie-light.png';
import toggle_dark from './assets/day.png';
import toggle_light from './assets/night.png';

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

    const [signInPressed, setSignInPressed] = useState(false);
    const [signUpPressed, setSignUpPressed] = useState(false);

    const handleSignIn = () => {
        setSignInPressed(true);
        setSignUpPressed(false);
    };

    const handleSignUp = () => {
      setSignInPressed(false);
      setSignUpPressed(true);
    }

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>

        <AppBar elevation={0} sx={{ bgcolor: themeMode === 'light' ? '#f4efefff' : '#000000', px: '7%', py: 1.5,}}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Stack direction="column" spacing={1} alignItems='center'>
                  <img src={themeMode === 'light' ? logo_light : logo_dark} alt="logo" style={{ width: '50px', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', cursor: 'pointer',}}/>

                  <Typography variant="h6" component="div" sx={{ color: themeMode === 'light' ? 'black': 'white', mt: 0.5, fontWeight: 550,}}>
                      Nutrify
                  </Typography>
                </Stack>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Button onClick={handleSignIn} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}}>
                    Sign In
                  </Button>

                  <Button onClick={handleSignUp} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}}>
                    Sign Up
                  </Button>
                </Stack>

                <img src={themeMode === 'light' ? toggle_light : toggle_dark} alt="toggle theme" onClick={toggleTheme} style={{ width: '50px', marginLeft: '20px', cursor: 'pointer', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', }}/>
              </Box>
            </Toolbar>  
        </AppBar>

        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)'}}>
            {signInPressed ? (<SignInForm theme={themeMode}/>) : (<SignUpForm theme={themeMode}/>)}
        </div>
      </ThemeProvider>
    );
}

export default App;
