import React from 'react';
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography, styled } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';

const SignInForm = () => {

  const [pressed, setPressed] = useState(false);
  
  return (
          <Container maxWidth="xs">
              <Paper elevation={10} sx={{ borderRadius: '20px', marginTop: 8, padding: 2, textAlign: 'center'}}>
                  <MailIcon style={{ color: "black", mx:"auto", mb:1 }}/>
                  <Typography component="h1" variant="h5" sx={{ color:"black", textAlign: "center" }}>
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
                            color: 'black',
                            borderBottom: '2px solid rgba(78, 196, 4, 1)',
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
                            color: 'rgba(78, 196, 4, 1)',
                          },
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            color: 'black',
                            borderBottom: '2px solid rgba(78, 196, 4, 1)',
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

                      <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', mt: 1, color: 'rgba(255, 255, 255, 1)', textTransform: 'none', fontSize: '18px', padding: '6px 12px', minWidth: 'auto'}} >
                          Sign In
                      </Button>

                      <Grid container justifyItems="center" justifyContent="center" sx={{mt: 3, mb:1.25}} alignItems="center" spacing={2}>
                        <Grid item xs={6}>
                            <Typography sx={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', color: 'black', textDecoration: 'none' }}>Don't have an account yet?</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Link component="button" sx={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', color: 'black', textDecoration: 'none', '&:hover': {textDecoration: 'underline',}, }}>Sign Up</Link>
                        </Grid>
                      </Grid>
                  </Box>
              </Paper>
          </Container>
  )
}

export default SignInForm;