import React, { useState, useMemo } from "react";
import SignUpForm from './components/SignUpForm.jsx';
import SignInForm from "./components/SignInForm.jsx";
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
                      <img src={themeMode === 'light' ? logo_light : logo_dark} alt="logo" style={{ width: '36px', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', cursor: 'pointer',}}/>

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
                {signInPressed ? (
                  <SignInForm theme={themeMode}/>
                  
                  // <Container maxWidth="xs">
                  //   <Paper elevation={10} sx={{ borderRadius: '20px', marginTop: 8, padding: 2, textAlign: 'center'}}>
                  //       <MailIcon style={{ color: themeMode === 'light' ? 'black':'rgba(78, 196, 4, 1)', mx:"auto", mb:1 }}/>
                        
                  //       <Typography component="h1" variant="h5" sx={{ color: themeMode === 'light' ? 'black':'rgba(78, 196, 4, 1)', textAlign: "center" }}>
                  //         Sign In
                  //       </Typography>
                  //       <Box component="form" noValidate sx={{mt: 1}}>
                  //           <TextField type="email"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" variant="standard" InputLabelProps={{
                  //               style: {
                  //                 color: 'rgba(78, 196, 4, 1)',
                  //               },
                  //             }}

                  //             InputProps={{
                  //               disableUnderline: true,
                  //               style: {
                  //                 color: themeMode === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                  //                 borderBottom: '2px solid rgba(78, 196, 4, 1)',
                  //               },
                  //             }}

                  //             sx={{ mb: 3, '& input::placeholder': { color: themeMode === 'light' ? 'black':'rgba(78, 196, 4, 1)', opacity: 1,}}} fullWidth required/>

                  //           <TextField type="password" value={password} placeholder="Password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} variant="standard" InputLabelProps={{
                  //               style: {
                  //                 color: 'rgba(78, 196, 4, 1)',
                  //               },
                  //             }}
                  //             InputProps={{
                  //               disableUnderline: true,
                  //               style: {
                  //                 color: themeMode === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                  //                 borderBottom: '2px solid rgba(78, 196, 4, 1)',
                  //               },
                  //             }}

                  //             sx={{
                  //               mb: 3,
                  //               '& input::placeholder': {
                  //                 color: themeMode === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                  //                 opacity: 1,
                  //               }
                  //             }}
                  //             fullWidth required
                  //           />

                  //           <Button onClick={handleAuthenticationSignIn} type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', mt: 1, color: themeMode === 'light' ? 'black':'white', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto'}} >
                  //               Sign In
                  //           </Button>

                  //           <Grid container justifyItems="center" justifyContent="center" sx={{mt: 3, mb:1.25}} alignItems="center" spacing={2}>
                  //             <Grid item xs={6}>
                  //                 <Button disableRipple disableElevation component="button" sx={{ backgroundColor: 'transparent', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: themeMode === 'light' ? 'black':'white', textTransform: 'none', '&:hover': { color: themeMode === 'light' ? 'black': 'white', backgroundColor: 'transparent', textDecoration: 'underline',}, }}>Forgot Password?</Button>
                  //             </Grid>
                  //           </Grid>
                  //       </Box>
                  //   </Paper>
                  // </Container>

                  ) : (
                  <SignUpForm theme={themeMode}/>
                  )}
            </div>
          </ThemeProvider>
    );
}

export default App;