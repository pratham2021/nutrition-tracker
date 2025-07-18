
import React from 'react';
import  { Box, Card, CardContent, Typography } from '@mui/material';


const ReusableComponent = () => {

  const items = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);

  return (
    <Box sx={{ p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Card Section Title
        </Typography>

        <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, mb: 2, scrollbarWidth: 'thin', '&::-webkit-scrollbar': { height: '8px', }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '4px',},}}>
            {items.map((item, index) => (
              <Card onClick={viewExistingEntry} key={index} sx={{ minWidth: 200, flexShrink: 0 }}>
                <CardContent>
                  <Typography variant="h6">{item}</Typography>
                  <Typography variant="body2">Some content</Typography>
                </CardContent>
              </Card>
            ))}
        </Box>

        <Typography variant="body1">
          This is a paragraph of text that appears below the scrollable cards. You can use it to provide additional context or instructions.
        </Typography>
    </Box>
  )
}

export default ReusableComponent;
