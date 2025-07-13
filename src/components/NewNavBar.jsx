import React from 'react';
import { AppBar, Toolbar, Typography, Box, Stack, Button } from '@mui/material';
import logo_dark from '../assets/smoothie-dark.png';
import logo_light from '../assets/smoothie-light.png';
import toggle_dark from '../assets/day.png';
import toggle_light from '../assets/night.png';

const NewNavBar = ({ theme, toggleTheme }) => {
  const isLight = theme === 'light';

  // <AppBar sx={{ backgroundColor: 'rgba(0, 0, 0, 1)' }}>
  //     <Toolbar sx={{ justifyContent: 'space-between', alignItems:'center' }}>
  //       <Typography variant="h6" component='div' sx={{ color: 'rgba(78, 196, 4, 1)' }}>
  //           Nutrify
  //       </Typography>
  //       <Stack direction='row' spacing={2}>
  //           <Button color="inherit" sx={{ color: 'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding:'0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none' }}>Sign In</Button>
  //           <Button color="inherit" sx={{ color: 'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding:'0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none' }}>Sign Up</Button>
  //       </Stack>
  //     </Toolbar>
  //   </AppBar>

  return (
    <AppBar elevation={0} sx={{ bgcolor: isLight ? '#ffffff' : '#000000', px: '7%', py: 1.5,}}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Logo */}
        <Box>
          <img
            src={isLight ? logo_light : logo_dark}
            alt="logo"
            style={{
              width: '50px',
              marginLeft: '40px',
              filter: isLight ? 'none' : 'brightness(0) invert(1)',
              cursor: 'pointer',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Stack direction="row" spacing={2}>
            <Button sx={{ color: 'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}}>
              Sign In
            </Button>

            <Button sx={{ color: 'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '36px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}}>
              Sign Up
            </Button>
          </Stack>

          <img
            src={isLight ? toggle_light : toggle_dark}
            alt="toggle theme"
            onClick={toggleTheme}
            style={{
              width: '50px',
              marginLeft: '20px',
              cursor: 'pointer',
              filter: isLight ? 'none' : 'brightness(0) invert(1)',
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NewNavBar;
