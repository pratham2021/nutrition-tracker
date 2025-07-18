import React, { useState, useMemo, useEffect } from "react";
import { Alert, AppBar, Button, Box, Card, CardContent, createTheme, CssBaseline,  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar, Stack, TextField, Toolbar, Typography, ThemeProvider} from '@mui/material';
import { app, auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc, documentId, getDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import logo_dark from '../assets/smoothie-dark.png';
import logo_light from '../assets/smoothie-light.png';
import toggle_dark from '../assets/day.png';
import toggle_light from '../assets/night.png';
import ReusableComponent from '../components/ReusableComponent.jsx';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [themeMode, setThemeMode] = useState('light');
    const navigate = useNavigate();
    // const [items, setItems] = useState([]);
    const items = Array.from({ length: 20 }, (_, i) => `Card ${1}`);
    const [openDialog, setOpenDialog] = useState(false);
    const [errors, setErrors] = useState();

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState("");
    const [snackBarSeverity, setSnackBarSeverity] = useState("success");

    const [AIResponses, setAIResponses] = useState({});

    const [breakfastItems, setBreakfastItems] = useState(['']);
    const [lunchItems, setLunchItems] = useState(['']);
    const [dinnerItems, setDinnerItems] = useState(['']);

    const [mainDocIDs, setMainDocIDs] = useState([]);
    const [subCollections, setSubCollections] = useState({});

    const fetchMainDocuments = async () => {
        if (user) {
            const mainCollectionReference = collection(db, user.uid);
            const q = query(mainCollectionReference, orderBy("createdAt", "desc")); 
            const snapshot = await getDocs(q);

            const docIds = snapshot.docs.map(doc => doc.id);
            setMainDocIDs(docIds);
        }
        else {
            setMainDocIDs([]);
            return;
        }
    };

    const fetchNutritionData = async () => {
        if (!user) return;
        const newItems = [];
        for (const mainDocID of mainDocIDs) {
            const mealDocRef = doc(db, user.uid, mainDocID, "", "");
            const mealDocSnap = await getDoc(mealDocRef);
            if (mealDocSnap.exists()) {
                const data = mealDocSnap.data();
                newItems.push({
                    ["r"]: {
                        "breakfast": data.Breakfast || [],
                        "lunch": data.Lunch || [],
                        "dinner": data.Dinner || [],
                    }
                });
            }
            else {

            }
        }
        
    };
    
    const handleSnackBarClose = () => {
        setSnackBarOpen(false);
        setSnackBarMessage("");
    }

    const checkIfUserHasAlreadyEnteredSomethingForTheDay = async () => {
        if (user) {
            const mainCollection = user.uid;

            const todaysDate = new Date();
            const subID = todaysDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });

            const dateObj = new Date(subID);

            const { start, end } = getWeekRange(dateObj); 

            const mainDocumentID = `${start.toDateString()} - ${end.toDateString()}`;

            const subDocRef = doc(db, mainCollection, mainDocumentID, subID, subID);

            try {
                const subDoc = await getDoc(subDocRef);

                if (subDoc.exists()) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return false;
            }
        }
    }

    const bringUpNewEntryPopUp = async () => {
        const userHasAlreadyEnteredSomethingForTheDay = await checkIfUserHasAlreadyEnteredSomethingForTheDay();
        if (userHasAlreadyEnteredSomethingForTheDay) {
            setSnackBarOpen(true);
            setSnackBarMessage("You have already entered your meals for the day! Please return tomorrow!");
            setSnackBarSeverity("warning"); 
        }
        else {
            setOpenDialog(true);
        }
    };

    const viewExistingEntry = () => {
        console.log("Card Clicked!");
    };

    const closePopUp = () => {
        setOpenDialog(false);
    };
    
    const toggleTheme = () => {
        setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
    
    const theme = useMemo(() => createTheme({
        palette: {
            mode: themeMode,
        },
    }), [themeMode]);

    function hasEmptyItem(items) {
        return items.some(item => item === "");
    };

    function getWeekRange(date) {
        const current = new Date(date);
        const day = current.getDay();
        const start = new Date(current);
        start.setDate(current.getDate() - day);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return { start, end };
    }

    const saveFoodDataToTheDatabase = async () => {
        if (user) {
            const collectionId = user.uid;

            const todaysDate = new Date();
            const documentId = todaysDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
                
            console.log(documentId);

            const dateObj = new Date(documentId);

            const { start, end } = getWeekRange(dateObj);

            if (hasEmptyItem(breakfastItems) || hasEmptyItem(lunchItems) || hasEmptyItem(dinnerItems)) {
                setErrors("One or more items are left blank.");
                return;
            }

            const dataToBeSaved = {
                "Breakfast": breakfastItems,
                "Lunch": lunchItems,
                "Dinner": dinnerItems
            };

            const dateFormatOptions = { year: "numeric", month: "short", day: "numeric" };
            const formattedStart = start.toLocaleDateString("en-US", dateFormatOptions);
            const formattedEnd = end.toLocaleDateString("en-US", dateFormatOptions);

            const mainDocumentId = `${formattedStart} - ${formattedEnd}`;

            setSnackBarOpen(true);

            try {
                const mainDocumentReference = doc(db, collectionId, mainDocumentId);

                const mainDocSnap = await getDoc(mainDocumentReference);

                if (!mainDocSnap.exists()) {
                    await setDoc(mainDocumentReference, { "createdAt": serverTimestamp() });
                }

                const documentReference = doc(db, collectionId, mainDocumentId, documentId, documentId);

                await setDoc(documentReference, dataToBeSaved);
                setSnackBarMessage("Successfully saved to the database!");
                setSnackBarSeverity("success");

                setBreakfastItems(['']);
                setLunchItems(['']);
                setDinnerItems(['']);
            } catch (e) {
                setSnackBarMessage(`Error saving entry to the database: ${e.message}`);
                setSnackBarSeverity("warning");
            }
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
        if (user) {
            fetchMainDocuments();
        } else {
            setMainDocIDs([]);
        }
    }, [user]);

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
        saveFoodDataToTheDatabase();
        console.log("Closing...")
        closePopUp();
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
        textTransform: 'none',
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
                <Button disableFocusRipple disableRipple disableElevation onClick={bringUpNewEntryPopUp} variant="contained" sx={{ height: '30px', padding: '0.4rem 0.75rem', minWidth: '64px', lineHeight: 1.2, boxSizing: 'border-box', fontSize: '0.95rem', color: themeMode === 'light' ? 'black':'white', backgroundColor:'rgba(78, 196, 4, 1)', textTransform: 'none',}}>Add</Button>
            </Box>

            <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>
                <Box sx={{ p: 2, maxWidth: '100%', width: 'fit-content' }}>
                    {mainDocIDs.length !== 0 ? (
                        mainDocIDs.map(id => (
                            <Typography key={id} variant="h5" sx={{ color: themeMode === 'light' ? 'black' : 'white', mb: 2 }}>
                                {id}
                            </Typography>
                        ))
                    ) : (
                        <Typography>No entries found.</Typography>
                    )}
                
                    <Box sx={{ display: 'flex', justifyContent: items.length * 200 + items.length * 16 < window.innerWidth ? 'center' : 'flex-start', overflowX: 'auto', gap: 2, mb: 2, paddingBottom: '16px', scrollbarWidth: 'thin', '&::-webkit-scrollbar': { height: '8px' },'&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px',}, }}>
                        {items.map((item, index) => (
                            <Card onClick={viewExistingEntry} key={index} sx={{ borderRadius:'15px', minWidth: 200, flexShrink: 0, backgroundColor: 'rgba(0, 0, 0, 0.05)', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)', }, transition: 'background-color 0.3s', }}>
                                <CardContent>
                                    <Typography variant="h6">{item}</Typography>
                                    <Typography variant="body2">Some content</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                    
                    <Typography variant="body1">
                        Message
                    </Typography>
                </Box>
            </Box>


            <Dialog open={openDialog} onClose={closePopUp} aria-labelledby='dialog-title' fullWidth PaperProps={{ sx: { backgroundColor: themeMode === 'light' ? 'white' : 'rgb(10, 10, 10)' } }}>
                <DialogTitle id='dialog-title' aria-describedby='dialog-content' sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.25rem', color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'white',}}>
                    Food Entry
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} margin={2}>

                    <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)' }}>
                        Breakfast
                    </Typography>

                    {breakfastItems.map((item, i) => (
                        <TextField key={i} variant="outlined" label={`Meal ${i + 1}`} value={item} onChange={(e) => handleChange('breakfast', i, e.target.value)} sx={inputSx} fullWidth/>
                    ))}

                    <Button variant="outlined" onClick={() => addField('breakfast')} sx={buttonSx}>
                        Add Breakfast Item
                    </Button>

                    <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)' }}>
                        Lunch
                    </Typography>

                    {lunchItems.map((item, i) => (
                        <TextField key={i} variant="outlined" label={`Meal ${i + 1}`} value={item} onChange={(e) => handleChange('lunch', i, e.target.value)} sx={inputSx} fullWidth/>
                    ))}

                    <Button variant="outlined" onClick={() => addField('lunch')} sx={buttonSx}>
                        Add Lunch Item
                    </Button>

                    <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)' }}>
                        Dinner
                    </Typography>

                    {dinnerItems.map((item, i) => (
                        <TextField key={i} variant="outlined" label={`Meal ${i + 1}`} value={item} onChange={(e) => handleChange('dinner', i, e.target.value)} sx={inputSx} fullWidth/>
                    ))}
                    
                    <Button variant="outlined" onClick={() => addField('dinner')} sx={buttonSx}>
                        Add Dinner Item
                    </Button>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button disableElevation disableRipple variant="contained" onClick={handleSave} sx={{ backgroundColor: 'rgba(78, 196, 4, 1)',color: themeMode === 'light' ? 'rgb(10, 10, 10)' : 'white', '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none' },}}>Save</Button>
                    <Button disableElevation disableRipple variant="contained" color="error" onClick={closePopUp} sx={{ '&:hover': { backgroundColor: (theme) => theme.palette.error.main, boxShadow: 'none' },}}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackBarOpen} autoHideDuration={2500} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackBarClose} severity={snackBarSeverity} sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>

        </ThemeProvider>
    </>
    );
};

export default Dashboard;