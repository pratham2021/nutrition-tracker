import React, { useState, useMemo, useEffect } from "react";
import { AppBar, Button, Toolbar, Typography, Box, createTheme, CssBaseline, Stack, ThemeProvider} from '@mui/material';
import { app, auth, db } from "../firebase.js";
import { deleteUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, deleteDoc } from "firebase/firestore";
import { useLocation, useNavigate } from 'react-router-dom';
import logo_dark from '../assets/smoothie-dark.png';
import logo_light from '../assets/smoothie-light.png';
import toggle_dark from '../assets/day.png';
import toggle_light from '../assets/night.png';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [themeMode, setThemeMode] = useState('light');
    const navigate = useNavigate();
    
    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode: themeMode,
        },
    }), [themeMode]);

    const handleAccountDeletion = async () => {
        if (!user) {
            console.error("No user is signed in.");
            return;
        }

        try {
            // await deleteDoc(doc(db, "users", user.uid));
            // await deleteUser(user);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigate("/");
        })
        .catch((error) => {
            console.error("Logout error:", error);
        })
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                navigate("/");
            }
        });
    }, []);
    
    return (
    <>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar elevation={0} sx={{ bgcolor: themeMode === 'light' ? '#f4efefff' : '#000000', px: '7%', py: 0.5,}}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Stack direction="column" spacing={0.3} alignItems='center'>
                            <img src={themeMode === 'light' ? logo_light : logo_dark} alt="logo" style={{ width: '36px', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', cursor: 'pointer',}}/>
                    
                            <Typography variant="h6" component="div" sx={{ fontSize: '1rem', color: themeMode === 'light' ? 'black': 'white', mt: '0px', fontWeight: 550, textAlign: 'center' }}>
                                Nutrify
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <Button onClick={handleSignOut} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}}>
                                Log Out
                            </Button>
                    
                            <Button onClick={handleAccountDeletion} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none',}}>
                                Delete
                            </Button>
                        </Stack>
                    
                        <img src={themeMode === 'light' ? toggle_light : toggle_dark} alt="toggle theme" onClick={toggleTheme} style={{ width: '36px', marginLeft: '20px', cursor: 'pointer', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', }}/>
                    </Box>
                </Toolbar>
            </AppBar>

        </ThemeProvider>
    </>
    );
};

export default Dashboard;