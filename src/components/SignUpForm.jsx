import React from 'react';
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

/* sx={{marginTop: 8, padding: 2}} is a common way to apply inline styling in Material-UI 
marginTop: 8 sets the top margin of the component (64 pixels off the top)
padding: 2 sets the padding on all sides of the component (two pixels on all sides)
*/

const SignUpForm = ({theme}) => {

  // console.log(theme);

  return (
    <Container maxWidth="xs">
        <Paper elevation={10} sx={{ borderRadius: '20px', marginTop: 8, padding: 2, textAlign: 'center'}}>
            <MailIcon style={{ color: theme === 'light' ? 'black':'rgba(78, 196, 4, 1)', mx:"auto", mb:1 }}/>

            <Typography component="h1" variant="h5" sx={{ textAlign: "center", color: theme === "light" ? "black":"rgba(78, 196, 4, 1)",  }}>
              Sign Up
            </Typography>

            <Box component="form" noValidate sx={{mt: 1}}>
                <TextField placeholder="Username"  variant="standard" InputLabelProps={{
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

                <TextField placeholder="First Name"  variant="standard" InputLabelProps={{
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

                <TextField placeholder="Last Name"  variant="standard" InputLabelProps={{
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

                <TextField type="email" placeholder="Email" variant="standard" InputLabelProps={{
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

                <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', mt: 1, color: theme === 'dark' ? 'white':'black', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto'}} >
                    Sign Up
                </Button>
            </Box>
        </Paper>
    </Container>
  )
}

export default SignUpForm;
