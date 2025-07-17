import React from 'react'

const CustomDialog = () => {
  return (
    <Dialog open={openDialog} onClose={closePopUp} aria-labelledby='dialog-title' fullWidth PaperProps={{ sx: { backgroundColor: themeMode === 'light' ? 'white' : 'rgb(10, 10, 10)' } }}>
      <DialogTitle
        id='dialog-title'
        aria-describedby='dialog-content'
        sx={{
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '1.25rem',
          color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'white',
        }}>
        Food Entry
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} margin={2}>
          {/* Breakfast */}
          <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)' }}>
            Breakfast
          </Typography>
          {breakfastItems.map((item, i) => (
            <TextField
              key={i}
              variant="outlined"
              label={`Meal ${i + 1}`}
              value={item}
              onChange={(e) => handleChange('breakfast', i, e.target.value)}
              sx={inputSx}
              fullWidth
            />
          ))}
          <Button variant="outlined" onClick={() => addField('breakfast')} sx={buttonSx}>
            Add Breakfast Item
          </Button>

          {/* Lunch */}
          <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)' }}>
            Lunch
          </Typography>
          {lunchItems.map((item, i) => (
            <TextField
              key={i}
              variant="outlined"
              label={`Meal ${i + 1}`}
              value={item}
              onChange={(e) => handleChange('lunch', i, e.target.value)}
              sx={inputSx}
              fullWidth
            />
          ))}
          <Button variant="outlined" onClick={() => addField('lunch')} sx={buttonSx}>
            Add Lunch Item
          </Button>

          {/* Dinner */}
          <Typography sx={{ color: themeMode === 'light' ? 'rgba(0, 0, 0, 1)' : 'rgba(78, 196, 4, 1)' }}>
            Dinner
          </Typography>
          {dinnerItems.map((item, i) => (
            <TextField
              key={i}
              variant="outlined"
              label={`Meal ${i + 1}`}
              value={item}
              onChange={(e) => handleChange('dinner', i, e.target.value)}
              sx={inputSx}
              fullWidth
            />
          ))}
          <Button variant="outlined" onClick={() => addField('dinner')} sx={buttonSx}>
            Add Dinner Item
          </Button>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          disableElevation
          disableRipple
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: 'rgba(78, 196, 4, 1)',
            color: themeMode === 'light' ? 'rgb(10, 10, 10)' : 'white',
            '&:hover': { backgroundColor: 'rgba(78, 196, 4, 1)', boxShadow: 'none' },
          }}
        >
          Save
        </Button>
        <Button
          disableElevation
          disableRipple
          variant="contained"
          color="error"
          onClick={closePopUp}
          sx={{
            '&:hover': { backgroundColor: (theme) => theme.palette.error.main, boxShadow: 'none' },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CustomDialog;