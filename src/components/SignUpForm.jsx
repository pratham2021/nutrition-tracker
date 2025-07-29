import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Container, Grid, Link, Paper, Snackbar, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { app, auth, db } from "../firebase.js";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

/* sx={{marginTop: 8, padding: 2}} is a common way to apply inline styling in Material-UI 
marginTop: 8 sets the top margin of the component (64 pixels off the top)
padding: 2 sets the padding on all sides of the component (two pixels on all sides)
*/

const SignUpForm = ({theme}) => {
  
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarSeverity, setSnackBarSeverity] = useState("success");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    if (user && location.pathname !== '/nutrition-tracker') {
      navigate('/nutrition-tracker');
    }
  }, [user, navigate, location.pathname]);

  const handleSnackBarClose = () => {
    setSnackBarOpen(false);
    setSnackBarMessage("");
  }

  async function addDocument(docId, data) {
      try {
        const documentReference = doc(db, "users", docId);
        await setDoc(documentReference, data);
      } catch (e) {
        setSnackBarMessage("Error saving you to the database!");
        setSnackBarSeverity("error");
        setSnackBarOpen(true);
      }
  }

  const handleSignUp = async (e) => {
    e.preventDefault();
    const input = [];

    if (userName === "") {
        input.push("Username field can't be empty"); 
    }
    if (firstName === "") {
        input.push("First Name field can't be empty.");
    }
    if (lastName === "") {
        input.push("Last Name field can't be empty");
    }
    if (email === "") {
        input.push("Email field can't be empty.");
    }
    if (password === "") {
        input.push("Password field can't be empty.");
    }

    setErrors(input);

    try {
        if (userName === "" || firstName === "" || lastName === "" || email === "" || password === "") {
            setSnackBarMessage("One or more fields are empty!");
            setSnackBarSeverity("error");
            setSnackBarOpen(true);
            return;
        }

        setErrors([]);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const userId = result.user.uid;

        if (result.user) {
            setSnackBarMessage("Successful Account Creation!");
            setSnackBarSeverity("success");
            setSnackBarOpen(true);
        }

        addDocument(userId, {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            id: userId
        });

        setUserName('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    }
    catch (error) {
        let userFriendlyMessage;

        switch (error.code) {
            case 'auth/email-already-in-use':
                userFriendlyMessage = "This email is already in use.";
                break;
            case 'auth/invalid-email':
                userFriendlyMessage = "Please enter a valid email address.";
                break;
            case 'auth/weak-password':
                userFriendlyMessage = "Password should be at least 6 characters.";
                break;
            case 'auth/operation-not-allowed':
                userFriendlyMessage = "Sign up is not allowed at this time.";
                break;
            default:
                userFriendlyMessage = error.message || "Something went wrong. Please try again.";
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

            <Typography component="h1" variant="h5" sx={{ textAlign: "center", color: theme === "light" ? "black":"rgba(78, 196, 4, 1)",  }}>
              Sign Up
            </Typography>

            <Box component="form" noValidate sx={{mt: 1}}>
                <TextField placeholder="Username" value={userName} variant="standard" onChange={(e) => setUserName(e.target.value)} InputLabelProps={{
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
                    mt: 1.5,
                    mb: 3,
                    '& input::placeholder': {
                      color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)',
                      opacity: 1,
                    }
                  }}
                  fullWidth required
                />

                <TextField placeholder="First Name" value={firstName}  variant="standard" onChange={(e) => setFirstName(e.target.value)} InputLabelProps={{
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

                <TextField placeholder="Last Name" value={lastName} variant="standard" onChange={(e) => setLastName(e.target.value)} InputLabelProps={{
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

                <TextField type="email" placeholder="Email" value={email}  variant="standard" onChange={(e) => setEmail(e.target.value)} InputLabelProps={{
                    style: {
                      color: 'rgba(78, 196, 4, 1))',
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

                <TextField type="password" placeholder="Password" value={password}  autoComplete="current-password" variant="standard" onChange={(e) => setPassword(e.target.value)} InputLabelProps={{
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

                <Button onClick={handleSignUp} variant="contained" fullWidth sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', mt: 1, color: theme === 'light' ? 'black':'white', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto'}} >
                    Sign Up
                </Button>
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

export default SignUpForm;
