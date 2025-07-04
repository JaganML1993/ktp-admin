import { fontFamily } from 'theme/typography';
import { useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import LocationTable from './LocationTable';

import { useNavigate } from 'react-router-dom';
import paths from 'routes/paths';

const OrdersStatus = () => {
  const [searchText, setSearchText] = useState('');
   const navigate = useNavigate(); 

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

   // Handler for the button
  const handleCreateCommitment = () => {
    navigate(paths.createLocation);
  };

  return (
    <Paper sx={{ px: 0 }}>
      <Stack
        px={3.5}
        spacing={1.5}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          flexGrow={1}
        >
          <Typography variant="h6" fontWeight={400} fontFamily={fontFamily.workSans}>
            Location
          </Typography>
          <TextField
            variant="filled"
            size="small"
            placeholder="Search for..."
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 220 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon={'mingcute:search-line'} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          spacing={1.5}
          direction={{ xs: 'column-reverse', sm: 'row' }}
          alignItems={{ xs: 'flex-end', sm: 'center' }}
        >
          {/* <DateSelect /> */}
          <Button variant="contained" size="small" onClick={handleCreateCommitment}>
            Create Location
          </Button>
        </Stack>
      </Stack>

      <Box mt={1.5} sx={{ height: 594, width: 1 }}>
        <LocationTable searchText={searchText} />
      </Box>
    </Paper>
  );
};

export default OrdersStatus;
