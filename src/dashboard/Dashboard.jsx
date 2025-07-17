import React, { useState, useMemo, useEffect } from "react";
import { AppBar, Button, Box, Card, CardContent, createTheme, CssBaseline,  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Stack, TextField, Toolbar, Typography, ThemeProvider} from '@mui/material';
import { app, auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo_dark from '../assets/smoothie-dark.png';
import logo_light from '../assets/smoothie-light.png';
import toggle_dark from '../assets/day.png';
import toggle_light from '../assets/night.png';


const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [themeMode, setThemeMode] = useState('light');
    const navigate = useNavigate();
    // const [items, setItems] = useState([]);
    const items = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
    const [openDialog, setOpenDialog] = useState(false);

    const bringUpPopUp = () => {
        setOpenDialog(true);

    };

    const closePopUp = () => {
        setOpenDialog(false);

    }
    
    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode: themeMode,
        },
    }), [themeMode]);

    const saveFoodDataToTheDatabase = () => {
        if (user) {
            const collectionId = user.uid;
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

    const [breakfastItems, setBreakfastItems] = useState(['']);
    const [lunchItems, setLunchItems] = useState(['']);
    const [dinnerItems, setDinnerItems] = useState(['']);

    const handleChange = (meal, index, value) => {
        let setter;
        let items;

        switch (meal) {
        case 'breakfast':
            items = [...breakfastItems];
            items[index] = value;
            setter = setBreakfastItems;
            break;
        case 'lunch':
            items = [...lunchItems];
            items[index] = value;
            setter = setLunchItems;
            break;
        case 'dinner':
            items = [...dinnerItems];
            items[index] = value;
            setter = setDinnerItems;
            break;
        default:
            return;
        }
        setter(items);
    };

    const addField = (meal) => {
        let setter;
        let items;

        switch (meal) {
            case 'breakfast':
                setter = setBreakfastItems;
                items = [...breakfastItems, ''];
                break;
            case 'lunch':
                setter = setLunchItems;
                items = [...lunchItems, ''];
                break;
            case 'dinner':
                setter = setDinnerItems;
                items = [...dinnerItems, ''];
                break;
            default:
                return;
        }
        setter(items);
    };

    const handleSave = () => {
        saveFoodDataToTheDatabase({
        breakfast: breakfastItems,
        lunch: lunchItems,
        dinner: dinnerItems,
        });
    };

    const inputSx = {
        '& .MuiOutlinedInput-root.Mui-focused fieldset': {
        borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)',
        },
        '& .MuiOutlinedInput-root:hover fieldset': {
        borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
        color: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)',
        },
    };

    const buttonSx = {
        color: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)',
        borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)',
        '&:hover': {
        borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)',
        backgroundColor: themeMode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(78, 196, 4, 0.15)',
        },
        marginTop: 1,
    };

    
        
    return (
    <>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <AppBar elevation={0} sx={{ bgcolor: themeMode === 'light' ? '#f4efefff' : '#000000', px: '56px', py: 0.5, height: '64px' }}>
                <Toolbar sx={{ minHeight: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Stack direction="column" spacing={0.3} alignItems='center'>
                            <img src={themeMode === 'light' ? logo_light : logo_dark} alt="logo" style={{ width: '36px', height: '36px', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', cursor: 'pointer',}}/>
                    
                            <Typography variant="h6" component="div" sx={{ fontSize: '1rem', color: themeMode === 'light' ? 'black': 'white', mt: '0px', fontWeight: 550, textAlign: 'center' }}>
                                NutriLife
                            </Typography>
                        </Stack>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <Button onClick={handleSignOut} sx={{ color: themeMode === 'light' ? 'black':'white', backgroundColor: 'rgba(78, 196, 4, 1)', fontSize: '0.95rem', height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none',} }}>
                                Log Out
                            </Button>
                        </Stack>
                    
                        <img src={themeMode === 'light' ? toggle_light : toggle_dark} alt="toggle theme" onClick={toggleTheme} style={{ width: '36px', height: '36px', marginLeft: '20px', cursor: 'pointer', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', }}/>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar/>

            <Box sx={{ display: 'inline-flex', justifyContent: 'flex-start', mt: 2, px: 2,}}>
                <Button disableFocusRipple disableRipple disableElevation onClick={bringUpPopUp} variant="contained" sx={{ height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', fontSize: '0.95rem', color: themeMode === 'light' ? 'black':'white', backgroundColor:'rgba(78, 196, 4, 1)', textTransform: 'none',}}>Add</Button>
            </Box>

            <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, p: 2, scrollbarWidth: 'thin', '&::-webkit-scrollbar': { height: '8px', }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px',},}}>
                {items.map((item, index) => (
                    <Card key={index} sx={{ minWidth: 200, flexShrink: 0 }}>
                        <CardContent>
                            <Typography variant="h6">{item}</Typography>
                            <Typography variant="body2">Some content</Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Dialog open={openDialog} onClose={closePopUp} aria-labelledby='dialog-title' fullWidth PaperProps={{ sx: { backgroundColor: themeMode === 'light' ?  'white': 'rgb(10, 10, 10)'}, }}>
                <DialogTitle id='dialog-title' aria-describedby='dialog-content' sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.25rem', color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)':'white' }}>Food Entry</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)'}}>Breakfast</Typography>
                        <TextField variant="outlined" label="Meal 1" sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' }, '& .MuiOutlinedInput-root:hover fieldset': { borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' }, '& .MuiInputLabel-root.Mui-focused': { color: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' },}}/>
                        
                        <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)'}}>Lunch</Typography>
                        <TextField variant="outlined" label="Meal 1" sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' }, '& .MuiOutlinedInput-root:hover fieldset': { borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' }, '& .MuiInputLabel-root.Mui-focused': { color: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' },}}/>
                        
                        <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)'}}>Dinner</Typography>
                        <TextField variant="outlined" label="Meal 1" sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' }, '& .MuiOutlinedInput-root:hover fieldset': { borderColor: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' }, '& .MuiInputLabel-root.Mui-focused': { color: themeMode === 'light' ? 'black' : 'rgba(78, 196, 4, 1)' },}}/>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button disableElevation disableRipple variant='contained' onClick={saveFoodDataToTheDatabase} sx={{ backgroundColor: 'rgba(78, 196, 4, 1)', color: themeMode === 'light'? 'rgb(10, 10, 10)': 'white', '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none',} }}>Save</Button>
                    <Button disableElevation disableRipple variant='contained' color="error" onClick={closePopUp} sx={{ '&:hover': { backgroundColor: (theme) => theme.palette.error.main, boxShadow: 'none',}}}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    </>
    );
};

export default Dashboard;