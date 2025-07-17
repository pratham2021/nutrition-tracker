import React from 'react';
import React, {useEffect} from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const CustomDatePicker = () => {
  return (
    <div>
      <LocalizationProvider>
          <DatePicker/>
      </LocalizationProvider>
    </div>
  )
}

export default CustomDatePicker;