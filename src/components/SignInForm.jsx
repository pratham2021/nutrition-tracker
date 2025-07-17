import React, { useState, useEffect }  from 'react';
import { Alert, Box, Button, Container, Grid, Link, Paper, Snackbar, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../firebase.js";
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const SignInForm = ({theme}) => {

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState("success");

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
    setSnackBarMessage("");
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    const input = [];

    if (email === "") {
        input.push("Email field can't be empty.");
    }
    
    if (password === "") {
        input.push("Password field can't be empty.");
    }
    
    setErrors(input);

    try {
      if (email === "" || password === "") {
          const message = errors.join("\n");
          setSnackBarMessage(message);
          setSnackBarSeverity("error");
          setSnackBarOpen(true);
          return;
      }
      else {
          setErrors([]);
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      if (userCredential.user) {
          setSnackBarMessage("Successful Sign In!");
          setSnackBarSeverity("success");
          setSnackBarOpen(true);
      }
   }
    catch (error) {
        console.log(error);

        let userFriendlyMessage;

        switch (error.code) {
          case 'auth/wrong-password':
            userFriendlyMessage = "Incorrect password. Please try again.";
            break;
          case 'auth/user-not-found':
            userFriendlyMessage = "Not account found with this email.";
            break;     
          case 'auth/invalid-email':
            userFriendlyMessage = "Please enter a valid email address.";
            break;
          case 'auth/too-many-requests':
            userFriendlyMessage = "Too many attempts. Please try again later.";
            break;
          case 'auth/user-disabled':
            userFriendlyMessage = "This user account has been disabled";
            break;
          default:
            userFriendlyMessage = 'Error: Invalid Authentication Credentials';
        }

        setSnackBarMessage(userFriendlyMessage);
        setSnackBarSeverity("error");
        setSnackBarOpen(true);
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

                      <Button disableRipple disableElevation onClick={handleSignIn} type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', mt: 1, color: theme === 'light' ? 'black':'white', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto', '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none',}}} >
                          Sign In
                      </Button>

                      <Grid container justifyItems="center" justifyContent="center" sx={{mt: 3, mb:1.25}} alignItems="center" spacing={2}>
                        <Grid item xs={6}>
                            <Button disableRipple disableElevation component="button" sx={{ backgroundColor: 'transparent', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: theme === 'light' ? 'black':'white', textTransform: 'none', '&:hover': { color: theme === 'light' ? 'black': 'white', backgroundColor: 'transparent', textDecoration: 'underline', '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none',}}, }}>Forgot Password?</Button>
                        </Grid>
                      </Grid>
                  </Box>
              </Paper>

              <Snackbar open={snackBarOpen} autoHideDuration={2500} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                  <Alert onClose={handleSnackBarClose} severity={snackBarSeverity} sx={{ width: '100%' }}>
                      {snackBarMessage}
                  </Alert>
              </Snackbar>
          </Container>
  )
}

export default SignInForm;