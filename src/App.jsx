import React, { useState, useMemo } from "react";
import SignUpForm from './components/SignUpForm.jsx';
import SignInForm from "./components/SignInForm.jsx";
import { AppBar, Button, Toolbar, Typography, Box, createTheme, CssBaseline, Stack, ThemeProvider} from '@mui/material';
import logo_light from '/smoothie-light.png';
import toggle_dark from '/day.png';
import toggle_light from '/night.png';


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

    const handleSignIn = () => {
        setSignInPressed(true);
    };

    const handleSignUp = () => {
        setSignInPressed(false);
    }

    return (
          <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar elevation={0} sx={{ bgcolor: themeMode === 'light' ? '#f4efefff' : '#000000', px: '7%', py: 0.5,}}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Stack direction="column" spacing={0.3} alignItems='center'>
                      <img src={logo_light} alt="logo" style={{ width: '36px', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', cursor: 'pointer',}}/>

                      <Typography variant="h6" component="div" sx={{ fontSize: '1rem', color: themeMode === 'light' ? 'black': 'white', mt: '0px', fontWeight: 550, textAlign: 'center' }}>
                          NutriLife
                      </Typography>
                    </Stack>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Button onClick={handleSignIn} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}} disableRipple>
                        Sign In
                      </Button>

                      <Button onClick={handleSignUp} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}} disableRipple>
                        Sign Up
                      </Button>
                    </Stack>

                    <img src={themeMode === 'light' ? toggle_light : toggle_dark} alt="toggle theme" onClick={toggleTheme} style={{ width: '36px', marginLeft: '20px', cursor: 'pointer', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', }}/>
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