import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Grid, Paper, Typography, TextField, Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as he from 'he';

const defaultState = {
  locationName: '',
  lat: '',
  lng: '',
  itineraryTip: '',
  whatToPack: '',
  photogenicForecastContent: '',
  bestTimeToVisit: '',
  images: [] as File[],
  existingImages: [] as string[],
};

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const EditLocation = () => {
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/location-details/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch location details');
        const { data } = await res.json();
        setForm((prev) => ({
          ...prev,
          locationName: data.locationName,
          lat: String(data.lat),
          lng: String(data.lng),
           itineraryTip: he.decode(data.itineraryTip || ''),
          whatToPack: he.decode(data.whatToPack || ''),
          photogenicForecastContent: he.decode(data.photogenicForecastContent || ''),
          bestTimeToVisit: he.decode(data.bestTimeToVisit || ''),
          existingImages: data.photogenicForecastImages || [],
        }));
      })
      .catch(() => setError('Failed to load location details'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? Array.from(e.target.files || []) : value,
    }));
  };

  const handleRichTextChange = (name: keyof typeof form) => (value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('locationName', form.locationName);
    formData.append('lat', form.lat);
    formData.append('lng', form.lng);
    formData.append('itineraryTip', form.itineraryTip);
    formData.append('whatToPack', form.whatToPack);
    formData.append('photogenicForecastContent', form.photogenicForecastContent);
    formData.append('bestTimeToVisit', form.bestTimeToVisit);

    form.images.forEach((file) => {
      formData.append('photogenicImages', file);
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/update-location/${id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || 'Failed to update location');
        setSubmitting(false);
        return;
      }
      navigate(-1);
    } catch (err) {
      setError('Error updating location');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Edit Location
          </Typography>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="locationName"
                  label="Location Name"
                  value={form.locationName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lat"
                  label="Latitude"
                  value={form.lat}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lng"
                  label="Longitude"
                  value={form.lng}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Itinerary Tip
                </Typography>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={form.itineraryTip}
                  onChange={handleRichTextChange('itineraryTip')}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Best Time to Visit
                </Typography>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={form.bestTimeToVisit}
                  onChange={handleRichTextChange('bestTimeToVisit')}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Photogenic Forecast
                </Typography>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={form.photogenicForecastContent}
                  onChange={handleRichTextChange('photogenicForecastContent')}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  {form.images.length > 0
                    ? `${form.images.length} image(s) selected`
                    : 'Upload New Images'}
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleInputChange}
                  />
                </Button>
              </Grid>

              {form.existingImages.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Existing Images
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {form.existingImages.map((img, i) => (
                      <img
                        key={i}
                        src={
                          img.startsWith('http')
                            ? img
                            : `${import.meta.env.VITE_API_BASE_URL}/uploads/${img.replace(/^uploads[\\/]/, '')}`
                        }
                        alt={`img-${i}`}
                        style={{
                          width: 100,
                          height: 70,
                          objectFit: 'cover',
                          borderRadius: 4,
                          border: '1px solid #ccc',
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/100x70?text=Image+Not+Found';
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>
              )}

              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => navigate(-1)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? <CircularProgress size={24} /> : 'Update'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditLocation;
