import React from 'react';
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';

const NavBar = () => {
  return (
    <AppBar sx={{ backgroundColor: 'rgba(0, 0, 0, 1)' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems:'center' }}>
        <Typography variant="h6" component='div' sx={{ color: 'rgba(78, 196, 4, 1)' }}>
            Nutrify
        </Typography>
        <Stack direction='row' spacing={2}>
            <Button color="inherit" sx={{ color: 'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding:'0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none' }}>Sign In</Button>
            <Button color="inherit" sx={{ color: 'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding:'0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none' }}>Sign Up</Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
