import { useMemo, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import LuggageOutlinedIcon from '@mui/icons-material/LuggageOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SearchIcon from '@mui/icons-material/Search';

interface Trip {
  _id: string;
  venue: string;
  price: string;
  images: string[];
  duration: string;
  popularity: number;
}

interface FilterSearchProps {
  trips: Trip[];
}

export default function FilterSearch({ trips }: FilterSearchProps) {
  const [count, setCount] = useState(1);

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          trips
            .map((trip) => trip.venue)
            .filter((v) => typeof v === 'string' && v.trim() !== '')
        )
      ),
    [trips]
  );
  const type = ['Domestic Trip',
    'International Trip',
    'Budget-Friendly Trip',
    'Adventure Trip',
    'Family Trip',
    'Honeymoon Trip',
    'Couple-Friendly Trip',
    'Luxury Trip'];

  const popperProps = {
    modifiers: [
      {
        name: 'zIndex',
        enabled: true,
        phase: 'beforeWrite' as const,
        fn: ({ state }: any) => {
          state.styles.popper.zIndex = '1500';
        },
      },
    ],
  };

  return (
    <div className="flex justify-center p-4">
      {/* Desktop Layout */}
      <div className="hidden xl:flex absolute -bottom-20 left-10 right-10 overflow-visible z-[1000]">
        <div className="w-full bg-white flex space-x-10 backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-8">
          {/* Location */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-blue-50 rounded-full flex-shrink-0">
              <FmdGoodOutlinedIcon className="text-blue-600" fontSize="large" />
            </div>
            <Autocomplete
              disablePortal
              options={locations}
              slotProps={{ popper: popperProps }}
              sx={{ flexGrow: 1, minWidth: 0 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Where to?"
                  variant="outlined"
                  size="medium"
                  sx={{ width: '100%' }}
                />
              )}
            />
          </div>

          {/* Type */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-green-50 rounded-full flex-shrink-0">
              <LuggageOutlinedIcon className="text-green-600" fontSize="large" />
            </div>
            <Autocomplete
              disablePortal
              options={type}
              slotProps={{ popper: popperProps }}
              sx={{ flexGrow: 1, minWidth: 0 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type"
                  variant="outlined"
                  size="medium"
                  sx={{ width: '100%' }}
                />
              )}
            />
          </div>

          {/* Date */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-purple-50 rounded-full flex-shrink-0">
              <CalendarMonthOutlinedIcon className="text-purple-600" fontSize="large" />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date From"
                sx={{ flexGrow: 1, minWidth: 0 }}
                slotProps={{
                  textField: {
                    size: 'medium',
                    sx: { width: '100%' },
                  },
                }}
              />
            </LocalizationProvider>
          </div>

          {/* Guests */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 bg-orange-50 rounded-full flex-shrink-0">
              <PeopleOutlineIcon className="text-orange-600" fontSize="large" />
            </div>
            <Box
              sx={{ flexGrow: 1, minWidth: 0 }}
              className="flex items-center border border-gray-300 rounded-md py-2 justify-between"
            >
              <Button
                onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
                size="small"
                className="min-w-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0"
              >
                <Typography className="text-gray-600 font-bold">−</Typography>
              </Button>
              <Typography className="font-medium text-gray-700 text-center flex-1 min-w-0">
                {count} {count === 1 ? 'Guest' : 'Guests'}
              </Typography>
              <Button
                onClick={() => setCount((prev) => prev + 1)}
                size="small"
                className="min-w-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex-shrink-0"
              >
                <Typography className="text-gray-600 font-bold">+</Typography>
              </Button>
            </Box>
          </div>

          <div className="flex justify-center flex-shrink-0">
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-2 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden absolute -bottom-48 md:block xl:hidden w-full max-w-3xl z-[1000] overflow-visible">
        <div className="bg-white backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Location */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <FmdGoodOutlinedIcon className="text-blue-600" fontSize="medium" />
              </div>
              <Autocomplete
                disablePortal
                options={locations}
                slotProps={{ popper: popperProps }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Where to?"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>

            {/* Type */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-full">
                <LuggageOutlinedIcon className="text-green-600" fontSize="medium" />
              </div>
              <Autocomplete
                disablePortal
                options={type}
                slotProps={{ popper: popperProps }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>

            {/* Date */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-full">
                <CalendarMonthOutlinedIcon className="text-purple-600" fontSize="medium" />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date From"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: '100%' },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            {/* Guests */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-full">
                <PeopleOutlineIcon className="text-orange-600" fontSize="medium" />
              </div>
              <Box className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 justify-between">
                <Button
                  onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
                  size="small"
                  className="min-w-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Typography className="text-gray-600 text-sm font-bold">−</Typography>
                </Button>
                <Typography className="mx-2 text-sm font-medium text-gray-700">
                  {count} {count === 1 ? 'Guest' : 'Guests'}
                </Typography>
                <Button
                  onClick={() => setCount((prev) => prev + 1)}
                  size="small"
                  className="min-w-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Typography className="text-gray-600 text-sm font-bold">+</Typography>
                </Button>
              </Box>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              variant="contained"
              size="small"
              startIcon={<SearchIcon />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-xs"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden absolute -bottom-72 w-full max-w-sm z-[1000] overflow-visible">
        <div className="bg-white backdrop-blur-sm shadow-2xl rounded-2xl border border-white/20 p-4">
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-full">
                <FmdGoodOutlinedIcon className="text-blue-600" fontSize="small" />
              </div>
              <Autocomplete
                disablePortal
                options={locations}
                slotProps={{ popper: popperProps }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Where to?"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>

            {/* Type */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-50 rounded-full">
                <LuggageOutlinedIcon className="text-green-600" fontSize="small" />
              </div>
              <Autocomplete
                disablePortal
                options={type}
                slotProps={{ popper: popperProps }}
                sx={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </div>

            {/* Date */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-50 rounded-full">
                <CalendarMonthOutlinedIcon className="text-purple-600" fontSize="small" />
              </div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date From"
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: '100%' },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            {/* Guests */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-50 rounded-full">
                <PeopleOutlineIcon className="text-orange-600" fontSize="small" />
              </div>
              <Box className="flex items-center border border-gray-900 rounded-lg px-3 py-2 flex-1 justify-between">
                <Button
                  onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
                  size="small"
                  className="min-w-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Typography className="text-gray-600 text-xs font-bold">−</Typography>
                </Button>
                <Typography className="mx-2 text-xs font-medium text-gray-700">
                  {count} {count === 1 ? 'Guest' : 'Guests'}
                </Typography>
                <Button
                  onClick={() => setCount((prev) => prev + 1)}
                  size="small"
                  className="min-w-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <Typography className="text-gray-600 text-xs font-bold">+</Typography>
                </Button>
              </Box>
            </div>
          </div>

          <div className="mt-6">
            <Button
              variant="contained"
              size="medium"
              startIcon={<SearchIcon />}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
