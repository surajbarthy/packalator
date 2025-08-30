'use client';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState, useRef } from 'react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  label?: string;
  className?: string;
  showDuration?: boolean;
  startDate?: string;
}

export default function DatePicker({ 
  value, 
  onChange, 
  minDate, 
  label,
  className = "",
  showDuration = false,
  startDate
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (newValue: Dayjs | null) => {
    if (newValue) {
      onChange(newValue.format('YYYY-MM-DD'));
    }
    setIsOpen(false);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const calculateDuration = () => {
    if (!startDate) return null;
    const start = dayjs(startDate);
    const end = dayjs(value);
    return Math.ceil(end.diff(start, 'day', true));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={className}>
        <div
          ref={inputRef}
          onClick={handleOpen}
          className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-medium cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <div>{dayjs(value).format('ddd, MMM D')}</div>
          {showDuration && startDate && (
            <div className="text-sm text-gray-600">
              {calculateDuration()} Days
            </div>
          )}
        </div>
        
        <MUIDatePicker
          open={isOpen}
          onClose={handleClose}
          value={dayjs(value)}
          onChange={handleDateChange}
          minDate={minDate ? dayjs(minDate) : undefined}
          slotProps={{
            textField: { style: { display: 'none' } },
            popper: {
              placement: 'bottom-start',
              anchorEl: inputRef.current,
              sx: {
                zIndex: 9999,
                '& .MuiPaper-root': {
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                '& .MuiPickersDay-root': {
                  color: '#374151',
                  '&.Mui-selected': {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                  },
                },
                '& .MuiPickersCalendarHeader-root': {
                  color: '#374151',
                },
                '& .MuiPickersMonth-root': {
                  color: '#374151',
                  '&.Mui-selected': {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                  },
                },
                '& .MuiPickersYear-root': {
                  color: '#374151',
                  '&.MuiPickersYear-yearSelected': {
                    backgroundColor: '#3b82f6',
                    color: 'white',
                  },
                },
              },
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}
