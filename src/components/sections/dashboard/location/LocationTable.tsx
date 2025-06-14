import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';

interface Location {
  _id: string;
  locationName: string;
  lat: number;
  lng: number;
  itineraryTip?: string;
  whatToPack?: string;
  photogenicForecastContent?: string;
  bestTimeToVisit?: string;
  createdAt?: string;
  photogenicForecastImages?: string[];
}

interface LocationRow {
  id: string;
  order: number;
  locationName: string;
  lat: number;
  lng: number;
  itineraryTip: string;
  bestTimeToVisit: string;
  createdAt: string;
  fullData: Location;
}

interface Props {
  searchText: string;
}

const LocationTable = ({ searchText }: Props) => {
  const [rows, setRows] = useState<LocationRow[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/admin/location-list`);
        url.searchParams.append('page', String(paginationModel.page + 1));
        url.searchParams.append('limit', String(paginationModel.pageSize));
        if (searchText) url.searchParams.append('search', searchText);

        const res = await fetch(url.toString());
        const json = await res.json();
        const locations: Location[] = json.data.locations;

        const mappedRows = locations.map((loc, idx) => ({
          id: loc._id,
          order: paginationModel.page * paginationModel.pageSize + idx + 1,
          locationName: loc.locationName,
          lat: loc.lat,
          lng: loc.lng,
          itineraryTip: loc.itineraryTip || '-',
          bestTimeToVisit: loc.bestTimeToVisit || '-',
          createdAt: loc.createdAt ? format(new Date(loc.createdAt), 'dd MMM yyyy') : '-',
          fullData: loc,
        }));

        setRows(mappedRows);
        setRowCount(json.data.pagination.total);
      } catch (err) {
        console.error('Error loading locations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [paginationModel, searchText]);

  const handleViewClick = (loc: Location) => {
    setSelectedLocation(loc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLocation(null);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this location?');
    if (!confirm) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/delete-location/${id}`,
        { method: 'DELETE' },
      );

      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        handleClose();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete location');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting location');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/pages/location/edit/${id}`);
  };

  const columns: GridColDef<LocationRow>[] = [
    { field: 'order', headerName: '#', width: 50 },
    { field: 'locationName', headerName: 'Location Name', flex: 1 },
    { field: 'lat', headerName: 'Latitude', width: 100 },
    { field: 'lng', headerName: 'Longitude', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => {
        const location = params.row.fullData;
        return (
          <Box display="flex" gap={0.5}>
            <Tooltip title="View">
              <IconButton onClick={() => handleViewClick(location)} size="small" color="primary">
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(location._id)} size="small" color="success">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(location._id)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        autoHeight
        disableColumnMenu
        disableRowSelectionOnClick
      />

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: '85vh' } }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: 22,
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            px: 3,
          }}
        >
          📍 {selectedLocation?.locationName} Details
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600, width: '30%' }}>
                    Coordinates
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {selectedLocation?.lat}, {selectedLocation?.lng}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>Created At</td>
                  <td style={{ padding: '12px 16px' }}>
                    {selectedLocation?.createdAt
                      ? format(new Date(selectedLocation.createdAt), 'dd MMM yyyy')
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>Itinerary Tip</td>
                  <td
                    style={{ padding: '12px 16px' }}
                    dangerouslySetInnerHTML={{ __html: selectedLocation?.itineraryTip || '-' }}
                  />
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>Best Time to Visit</td>
                  <td
                    style={{ padding: '12px 16px' }}
                    dangerouslySetInnerHTML={{ __html: selectedLocation?.bestTimeToVisit || '-' }}
                  />
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>Photogenic Forecast</td>
                  <td
                    style={{ padding: '12px 16px' }}
                    dangerouslySetInnerHTML={{
                      __html: selectedLocation?.photogenicForecastContent || '-',
                    }}
                  />
                </tr>
                {selectedLocation?.photogenicForecastImages?.map((img, i) => {
                  const imageUrl = img.startsWith('http')
                    ? img
                    : `${import.meta.env.VITE_API_BASE_URL}/uploads/${img.replace(/^uploads[\\/]/, '')}`;
                  return (
                    <Box
                      key={i}
                      sx={{
                        width: 160,
                        height: 120,
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: 1,
                        m: 2,
                        display: 'inline-block',
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Image ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationTable;
