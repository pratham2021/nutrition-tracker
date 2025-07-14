import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { app, auth, db } from "../firebase.js";
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })

    return () => unsubscribe();
  }, [])

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  async function addDocument(docId, data) {
      try {
        const documentReference = doc(db, "users", docId);
        await setDoc(documentReference, data);
      } catch (e) {
        const input = ["Error saving you to the database"];
        setErrors(input);
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
        input.push("Email field can't be empty.");
    }

    setErrors(input);

    try {


        if (userName === "" || firstName === "" || lastName === "" || email === "" || password === "") {
          // Display Pop Up

          return;
        }

        setErrors([]);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const userId = result.user.uid;

        // Save that user onto the database
        addDocument(userId, {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            id: userId
        });

        // Clear the fields
        setUserName('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Route to the dashboard page after a 2 second delay
        navigate('/dashboard');
    }
    catch (error) {
        console.log(error);
        // Display Error Message
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
    </Container>
  )
}

export default SignUpForm;
