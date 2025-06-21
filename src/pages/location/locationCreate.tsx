import { useState, ChangeEvent, FormEvent } from 'react';
import { Grid, Paper, Typography, TextField, Button, Stack, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const defaultState = {
  locationName: '',
  lat: '',
  lng: '',
  itineraryTip: '',
  whatToPack: '',
  photogenicForecastContent: '',
  photogenicForecastLink: '',
  bestTimeToVisit: '',
  additionalField: '',
  images: [] as File[],
};

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const CreateLocation = () => {
  const [form, setForm] = useState(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? Array.from((e.target as HTMLInputElement).files ?? []) : value,
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
    formData.append('photogenicForecastLink', form.photogenicForecastLink);
    formData.append('bestTimeToVisit', form.bestTimeToVisit);
    formData.append('additionalField', form.additionalField);

    form.images.forEach((file) => {
      formData.append('photogenicImages', file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/save-location`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.errors?.[0]?.msg || data.message || 'Failed to create location');
        setSubmitting(false);
        return;
      }

      navigate(-1);
    } catch (err) {
      setError('Error creating location');
      setSubmitting(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ mt: 4, mb: 4 }}>
      <Grid item xs={12} sm={10} md={8} lg={6}>
        <Paper sx={{ p: { xs: 2, sm: 4 }, maxWidth: 600, width: '100%', mx: 'auto' }}>
          <Typography variant="h5" gutterBottom>
            Create Location
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
                  onChange={(value) => {
                    setForm((prev) => ({ ...prev, itineraryTip: value }));
                  }}
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
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, photogenicForecastContent: value }))
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="photogenicForecastLink"
                  label="Photogenic Forecast Image Link"
                  value={form.photogenicForecastLink}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  {form.images.length > 0
                    ? `${form.images.length} image(s) selected`
                    : 'Upload Images'}
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

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Additional Field
                </Typography>
                <TextField
                  name="additionalField"
                  label="Additional Field Name"
                  value={form.additionalField}
                  onChange={handleInputChange}
                  fullWidth
                />
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  value={form.bestTimeToVisit}
                  onChange={(value) => setForm((prev) => ({ ...prev, bestTimeToVisit: value }))}
                />
              </Grid>

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
                    {submitting ? <CircularProgress size={24} /> : 'Create'}
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

export default CreateLocation;
