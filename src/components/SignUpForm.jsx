import React from 'react';
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

/* sx={{marginTop: 8, padding: 2}} is a common way to apply inline styling in Material-UI 
marginTop: 8 sets the top margin of the component (64 pixels off the top)
padding: 2 sets the padding on all sides of the component (two pixels on all sides)
*/

const SignUpForm = () => {
  return (
    <Container maxWidth="xs">
        <Paper elevation={10} sx={{ borderRadius: '20px', marginTop: 8, padding: 2, textAlign: 'center'}}>
            <MailIcon style={{ color: "black", mx:"auto", mb:1 }}/>
            <Typography component="h1" variant="h5" sx={{ color:"black", textAlign: "center" }}>
              Sign Up
            </Typography>
            <Box component="form" noValidate sx={{mt: 1}}>
                <TextField placeholder="Username"  variant="standard" InputLabelProps={{
                    style: {
                      color: 'rgba(6, 167, 6, 1)',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'black',
                      borderBottom: '2px solid rgba(6, 167, 6, 1)',
                    },
                  }}

                  sx={{
                    mt: 1.5,
                    mb: 3,
                    '& input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    }
                  }}
                  fullWidth required
                />

                <TextField placeholder="First Name"  variant="standard" InputLabelProps={{
                    style: {
                      color: 'rgba(6, 167, 6, 1)',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'black',
                      borderBottom: '2px solid rgba(6, 167, 6, 1)',
                    },
                  }}

                  sx={{
                    mb: 3,
                    '& input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    }
                  }}
                  fullWidth required
                />

                <TextField placeholder="Last Name"  variant="standard" InputLabelProps={{
                    style: {
                      color: 'rgba(6, 167, 6, 1)',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'black',
                      borderBottom: '2px solid rgba(6, 167, 6, 1)',
                    },
                  }}

                  sx={{
                    mb: 3,
                    '& input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    }
                  }}
                  fullWidth required
                />

                <TextField type="email" placeholder="Email" variant="standard" InputLabelProps={{
                    style: {
                      color: 'rgba(6, 167, 6, 1)',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'black',
                      borderBottom: '2px solid rgba(6, 167, 6, 2)',
                    },
                  }}

                  sx={{
                    mb: 3,
                    '& input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    }
                  }}
                  fullWidth required
                />

                <TextField type="password" placeholder="Password" autoComplete="current-password" variant="standard" InputLabelProps={{
                    style: {
                      color: 'rgb(5, 155, 5)',
                    },
                  }}
                  InputProps={{
                    disableUnderline: true,
                    style: {
                      color: 'black',
                      borderBottom: '2px solid rgba(6, 167, 6, 1)',
                    },
                  }}

                  sx={{
                    mb: 3,
                    '& input::placeholder': {
                      color: 'black',
                      opacity: 1,
                    }
                  }}
                  fullWidth required
                />

                <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'rgba(6, 167, 6, 1)', mt: 1, color: 'rgba(255, 255, 255, 1)', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto'}} >
                    Sign Up
                </Button>

                <Grid container justifyItems="center" justifyContent="center" sx={{mt: 3, mb:1.25}} alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                      <Typography sx={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', color: 'black', textDecoration: 'none' }}>Already Have An Account?</Typography>
                  </Grid>

                  <Grid item xs={6}>
                      <Link component="button" sx={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', color: 'black', textDecoration: 'none', '&:hover': {textDecoration: 'underline',}, }}>Sign In</Link>
                  </Grid>
                </Grid>
            </Box>
        </Paper>
    </Container>
  )
}

export default SignUpForm;
