import React, { useState, useEffect }  from 'react';
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase.js";
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const SignInForm = ({theme}) => {

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser);
  //   })
  
  //   return () => unsubscribe();
  // }, []);
  
  // useEffect(() => {
  //   if (user && location.pathname !== '/dashboard') {
  //     navigate('/dashboard');
  //   }
  // }, [user, navigate, location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })
  
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (user && location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  }, [user, navigate, location.pathname]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const input = [];

    if (email === "") {
        input.push("Email field can't be empty.");
    }
    
    if (password === "") {
        input.push("Email field can't be empty.");
    }

    try {
      if (email === "" || password === "") {
          return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
    }
    catch (error) {
        console.log(error);
    }
  }
  
  return (
          <Container maxWidth="xs">
              <Paper elevation={10} sx={{ borderRadius: '20px', marginTop: 8, padding: 2, textAlign: 'center'}}>
                  <MailIcon style={{ color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)', mx:"auto", mb:1 }}/>
                  
                  <Typography component="h1" variant="h5" sx={{ color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)', textAlign: "center" }}>
                    Sign In
                  </Typography>
                  <Box component="form" noValidate sx={{mt: 1}}>
                      <TextField type="email"  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" variant="standard" InputLabelProps={{
                          style: {
                            color: 'rgba(78, 196, 4, 1)',
                          },
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                            borderBottom: '2px solid rgba(78, 196, 4, 1)',
                          },
                        }}

                        sx={{
                          mb: 3,
                          '& input::placeholder': {
                            color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                            opacity: 1,
                          }
                        }}
                        fullWidth required
                      />

                      <TextField type="password" value={password} placeholder="Password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} variant="standard" InputLabelProps={{
                          style: {
                            color: 'rgba(78, 196, 4, 1)',
                          },
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                            borderBottom: '2px solid rgba(78, 196, 4, 1)',
                          },
                        }}

                        sx={{
                          mb: 3,
                          '& input::placeholder': {
                            color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                            opacity: 1,
                          }
                        }}
                        fullWidth required
                      />

                      <Button onClick={handleSignIn} type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', mt: 1, color: theme === 'light' ? 'black':'white', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto'}} >
                          Sign In
                      </Button>

                      <Grid container justifyItems="center" justifyContent="center" sx={{mt: 3, mb:1.25}} alignItems="center" spacing={2}>
                        <Grid item xs={6}>
                            <Button disableRipple disableElevation component="button" sx={{ backgroundColor: 'transparent', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: theme === 'light' ? 'black':'white', textTransform: 'none', '&:hover': { color: theme === 'light' ? 'black': 'white', backgroundColor: 'transparent', textDecoration: 'underline',}, }}>Forgot Password?</Button>
                        </Grid>
                      </Grid>
                  </Box>
              </Paper>
          </Container>
  )
}

export default SignInForm;

      // color: theme === 'light' ? 'black' : 'white', // prevent color change
      // backgroundColor: 'transparent',              // prevent background change
      // textDecoration: 'underline',