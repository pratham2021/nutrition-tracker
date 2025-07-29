import React, { useState, useMemo, useEffect } from "react";
import { Alert, AppBar, Button, Box, Card, CardContent, createTheme, CssBaseline,  Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Snackbar, Stack, TextField, Toolbar, Typography, ThemeProvider, CardActionArea} from '@mui/material';
import { app, auth, db } from "../firebase.js";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, setDoc, documentId, getDoc, getDocs, query, where, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import logo_light from '../assets/smoothie-light.png';
import toggle_dark from '../assets/day.png';
import toggle_light from '../assets/night.png';
import axios from 'axios';

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [themeMode, setThemeMode] = useState('light');
    const navigate = useNavigate();
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

    const [weeks, setWeeks] = useState([]);
    const [weeklyResults, setWeeklyResults] = useState({});
    
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
            try {
                const docRef = doc(db, mainCollection, subID);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
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

    const viewExistingEntry = async (dayId) => {
        if (user) {
            const collectionName = user.uid;
            const docRef = doc(db, collectionName, dayId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const documentData = docSnap.data();
                console.log(documentData);
                setOpenDialog(true);
                setBreakfastItems(documentData.Breakfast);
                setLunchItems(documentData.Lunch);
                setDinnerItems(documentData.Dinner);
            }
        }
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
    };

    // const [weekSummaries, setWeeklySummaries] = useState({});

    const generateSuggestions = async (prompt) => {
        const msg = [
            {
                role: "system",
                content: "You are an assistant that suggests healthy diet reccommendations to users. Make sure to answer in complete sentences!"            
            },
            {
                role: "user",
                content: prompt
            }
        ];

        try {

            const response = await axios({
                method: "POST",
                url: "https://api.openai.com/v1/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                },
                data: {
                    model: 'gpt-3.5-turbo',
                    messages: msg,
                    temperature: 1,
                    top_p: 1,
                    max_tokens: 90,
                },
            });

            // console.log(response.data.choices[0].message.content);
            return response.data.choices[0].message.content || "";
        } catch (error) {
            console.log("Something went wrong. Couldn't fetch you a response.")
        }
    };

    function listOutFoods(array) {
        if (!array || array.length === 0) return "";

        if (array.length === 1) {
            return array[0];
        }
        else if (array.length === 2) {
            return `${array[0]} and ${array[1]}`;
        }

        const allButLast = array.slice(0, -1).join(", ");
        const last = array[array.length - 1];
        return `${allButLast}, and ${last}`;
    }

    // async function engineerPrompt(newResults) {
    //     for (const week of weeks) {
    //         var string = "";
    //         if (week in newResults) {
    //             if (!(week in weekSummaries)) {
    //                 const weekMeals = newResults[week];
    //                 for (let i = 0; i < weekMeals.length; i++) {
    //                     const breakfast_listed = listOutFoods(weekMeals[i].Breakfast);
    //                     const lunch_listed = listOutFoods(weekMeals[i].Lunch);
    //                     const dinner_listed = listOutFoods(weekMeals[i].Dinner);
    //                     string += `On ${weekMeals[i].day}, I had ${breakfast_listed} for breakfast. For lunch, I had ${lunch_listed}. For dinner, I had ${dinner_listed}. `;
    //                 }
    //                 string += "Generate me a five sentence detailing what improvements can be made to the user's diet.";
    //                 var weeklyDietSuggestion = await generateSuggestions(string);
    //                 await addFieldToWeekDocs(week, weeklyDietSuggestion);
    //             }
    //         }
    //     };
    // };

    async function engineerPrompt(week) {
        const isNotEmpty = weeklyResults && Object.keys(weeklyResults).length > 0;
        var suggestion_string = "";
        if (isNotEmpty) {
            if (week in weeklyResults) {
                const weekMeals = weeklyResults[week];
                for (let i = 0; i < weekMeals.length; i++) {
                    const breakfast_listed = listOutFoods(weekMeals[i].Breakfast);
                    const lunch_listed = listOutFoods(weekMeals[i].Lunch);
                    const dinner_listed = listOutFoods(weekMeals[i].Dinner);
                    suggestion_string += `On ${weekMeals[i].day}, I had ${breakfast_listed} for breakfast. For lunch, I had ${lunch_listed}. For dinner, I had ${dinner_listed}. `;
                }
                suggestion_string += "Generate me a five sentence diet recommendation detailing what improvements can be made to the user's diet.";
                
                var weeklyDietSuggestion = await generateSuggestions(suggestion_string);
                console.log(typeof weeklyDietSuggestion);
                console.log(weeklyDietSuggestion);
                return weeklyDietSuggestion;
            }
        }
    };

    async function getAllWeeks() {
        let weeks = [];

        const collectionReference = collection(db, user.uid);

        try {
            const snapshot = await getDocs(collectionReference);
            
            snapshot.forEach((doc) => {
                const data = doc.data();
                const week = data.week;
                if (!weeks.includes(week)) {
                    weeks.push(week);
                }
            });
        }
        catch (error) {
            return;
        }

        let sortedWeeks = weeks.sort((a, b) => {
            const startA = new Date(a.split(" - ")[0]);
            const startB = new Date(b.split(" - ")[0]);
            return startB - startA;
        });

        setWeeks(sortedWeeks);
    };

    // update it if it exists but creates a document if it does exist
    const saveFoodDataToTheDatabase = async (week) => {
        if (user) {
            const collectionId = user.uid;

            const todaysDate = new Date();
            const documentId = todaysDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });

            const dateObj = new Date(documentId);

            const { start, end } = getWeekRange(dateObj);

            if (hasEmptyItem(breakfastItems) || hasEmptyItem(lunchItems) || hasEmptyItem(dinnerItems)) {
                setErrors("One or more items are left blank.");
                return;
            }

            const dateFormatOptions = { year: "numeric", month: "short", day: "numeric" };
            const formattedStart = start.toLocaleDateString("en-US", dateFormatOptions);
            const formattedEnd = end.toLocaleDateString("en-US", dateFormatOptions);

            const mainDocumentId = `${formattedStart} - ${formattedEnd}`;

            const dataToBeSaved = {
                "Breakfast": breakfastItems,
                "Lunch": lunchItems,
                "Dinner": dinnerItems,
                "week": mainDocumentId,
                "day": documentId,
                "id": user.uid
            };

            setSnackBarOpen(true);

            try {
                const documentReference = doc(db, user.uid, documentId);
                await setDoc(documentReference, dataToBeSaved);

                setSnackBarMessage("Successfully saved to the database!");
                setSnackBarSeverity("success");

                setBreakfastItems(['']);
                setLunchItems(['']);
                setDinnerItems(['']);
            }
            catch (e) {
                setSnackBarMessage(`Error saving entry to the database: ${e.message}`);
                setSnackBarSeverity("warning");
            }
        }
    };
    
    function checkIfTodayIsInDateRange(dateRangeStr) {
        function stripTime(date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }

        const [startStr, endStr] = dateRangeStr.split(" - ");

        const startDate = stripTime(new Date(startStr));
        const endDate = stripTime(new Date(endStr));

        const today = stripTime(new Date());

        if (today < startDate) {
            return "before";
        } else if (today >= startDate && today <= endDate) {
            return "inside";
        } else {
            return "past";
        }
    }

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
            getAllWeeks();
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

    useEffect(() => {
        if (!user || weeks.length === 0) return;

        const processWeeks = async () => {
            for (const week of weeks) {
                const status = checkIfTodayIsInDateRange(week);
                if (status === "past") {
                    if (await checkNoPromptForWeek(user.uid, week)) {
                        const suggestion = await engineerPrompt(week);

                        await addFieldToWeekDocuments(user.uid, week, "prompt", suggestion);
                    }
                }
            }

            await fetchKeyForWeek(user.uid).then((dict) => {
                setAIResponses(dict);
            })
        };

        processWeeks();

    }, [weeks, user, weeklyResults, AIResponses]);

    async function fetchKeyForWeek(collectionId) {
        const docsRef = collection(db, collectionId);
        const snapshot = await getDocs(docsRef);

        const weeklySuggestions = {};

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const week = data.week;
            const prompt = data.prompt;

            if (week && prompt) {
                if (!(week in weeklySuggestions)) {
                    weeklySuggestions[week] = prompt;
                }
            }
        })
        
        return weeklySuggestions;
    }

    useEffect(() => {
        if (!user || weeks.length === 0) return;

        const collectionReference = collection(db, user.uid);
        const unsubscribes = [];

        for (const week of weeks) {
            const q = query(collectionReference, where("week", "==", week));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const docs = querySnapshot.docs.map((doc) => doc.data());
                setWeeklyResults((prev) => {
                    const newResults = { ...prev, [week]: docs };
                    return newResults;
                });
            });

            unsubscribes.push(unsubscribe);
        }

        return () => {
            unsubscribes.forEach((unsub) => unsub());
        };
    }, [user, weeks]);

    async function checkNoPromptForWeek(collectionName, weekValue) {
        const docsRef = collection(db, collectionName);
        const q = query(docsRef, where("week", "==", weekValue));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return true;
        }

        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            if (data.hasOwnProperty("prompt") && data.prompt !== null && data.prompt !== "") {
                return false;
            }
        }

        return true;
    };

    async function addFieldToWeekDocuments(collectionId, week, newKey, newValue) {
        const collectionRef = collection(db, collectionId);
        const q = query(collectionRef, where("week", "==", week));
        
        const querySnapshot = await getDocs(q);

        const updatePromises = querySnapshot.docs.map((doc) => {
            const docRef = doc.ref;
            return updateDoc(docRef, {
                [newKey]: newValue,
            });
        });

        await Promise.all(updatePromises);
    };

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

    const handleSave = (week) => {
        saveFoodDataToTheDatabase(week);
        console.log("Closing...");
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
        <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar elevation={0} sx={{ bgcolor: themeMode === 'light' ? '#f4efefff' : '#000000', px: '56px', py: 0.5, height: '64px' }}>
                    <Toolbar sx={{ minHeight: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Stack direction="column" spacing={0.3} alignItems='center'>
                                <img src={logo_light} alt="logo" style={{ width: '36px', height: '36px', filter: themeMode === 'light' ? 'none' : 'brightness(0) invert(1)', cursor: 'pointer',}}/>
                        
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

                {weeks.length !== 0 ? (
                    weeks.map((week) => (
                        <Box key={week} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ p: 2, maxWidth: '100%', width: 'fit-content' }}>
                                <Typography variant="h5" sx={{ color: themeMode === 'light' ? 'black' : 'white', mb: 2 }}>
                                    {week}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: items.length * 200 + items.length * 16 < window.innerWidth ? 'center' : 'flex-start', overflowX: 'auto', gap: 2, mb: 2, paddingBottom: '16px', scrollbarWidth: 'thin', scrollbarColor: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)', '&::-webkit-scrollbar': { height: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#f0f0f0' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#999', borderRadius: '4px', },}}>
                                {(weeklyResults[week] || []).map((dayResult) => (
                                    <Card key={dayResult.day} onClick={() => viewExistingEntry(dayResult.day)} sx={{ borderRadius: '15px', width: 'fit-content', maxWidth: 200, maxHeight: 200, backgroundColor: 'rgba(0, 0, 0, 0.05)', flexShrink: 1, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' }, transition: 'background-color 0.3s', overflowY: 'auto',}}>
                                        <CardContent>
                                            <Typography variant="body1" align="center" sx={{ fontWeight: 'bold', mb: 1.5 }}>{dayResult.day}</Typography>

                                            <Typography variant="body1">Breakfast: </Typography>

                                            {(dayResult.Breakfast || []).map((item, index) => (
                                                <li key={index} style={{ wordWrap: 'break-word', whiteSpace: 'normal', paddingLeft: '1.2em', listStyleType: 'disc', textIndent: '-1.2em',}}>{item}</li>
                                            ))}

                                            <Typography variant="body1">Lunch: </Typography>
                                            
                                            {(dayResult.Lunch || []).map((item, index) => (
                                                <li key={index} style={{ wordWrap: 'break-word', whiteSpace: 'normal', paddingLeft: '1.2em', listStyleType: 'disc', textIndent: '-1.2em',}}>{item}</li>
                                            ))}

                                            <Typography variant="body1">Dinner: </Typography>
                                            
                                            {(dayResult.Dinner || []).map((item, index) => (
                                                <li key={index} style={{ wordWrap: 'break-word', whiteSpace: 'normal', paddingLeft: '1.2em', listStyleType: 'disc', textIndent: '-1.2em',}}>{item}</li>
                                            ))}

                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                            <Typography sx={{ marginLeft: '2em', textIndent: '2em' }}>{AIResponses[week] || ""}</Typography>

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
                                    <Button disableElevation disableRipple variant="contained" onClick={() => handleSave(week)} sx={{ backgroundColor: 'rgba(78, 196, 4, 1)',color: themeMode === 'light' ? 'rgb(10, 10, 10)' : 'white', '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none' },}}>Save</Button>
                                    <Button disableElevation disableRipple variant="contained" color="error" onClick={closePopUp} sx={{ '&:hover': { backgroundColor: (theme) => theme.palette.error.main, boxShadow: 'none' },}}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Box>                        
                    ))
                ) : (
                    <Typography></Typography>
                )}

                <Snackbar open={snackBarOpen} autoHideDuration={2500} onClose={handleSnackBarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                    <Alert onClose={handleSnackBarClose} severity={snackBarSeverity} sx={{ width: '100%' }}>
                        {snackBarMessage}
                    </Alert>
                </Snackbar>


        </ThemeProvider>
    )
};

export default Dashboard;