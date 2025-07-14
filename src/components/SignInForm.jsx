import React, { useState }  from 'react';
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { app, auth } from "../firebase.js";
import { useSignInWithEmailAndPassword, useAuthState } from 'react-firebase-hooks/auth';

const SignInForm = ({theme}) => {

  const [signInpressed, setSignInPressed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState([]);

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

        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
          setEmail('');
          setPassword('');
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log('Error signing in:');
        });
        
        // Route to the dashboard page
        
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
                      <TextField type="email" placeholder="Email" variant="standard" InputLabelProps={{
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

                      <TextField type="password" placeholder="Password" autoComplete="current-password" variant="standard" InputLabelProps={{
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
                            <Link component="button" sx={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', color: theme === 'light' ? 'black':'white', textDecoration: 'none', '&:hover': {textDecoration: 'underline',}, }}>Forgot Password?</Link>
                        </Grid>
                      </Grid>
                  </Box>
              </Paper>
          </Container>
  )
}

export default SignInForm;