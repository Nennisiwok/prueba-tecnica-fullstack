import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { getRace } from '../api/races';
import { formatDate } from '../utils/format';

export default function RaceDetailPage() {
  const { raceId } = useParams();
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    getRace(raceId)
      .then((data) => {
        if (!ignore) setRace(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [raceId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">No se pudo cargar la carrera: {error}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 1 }}>
          Carreras
        </Button>
        <Typography variant="h4" component="h1">
          {race.name}
        </Typography>
        <Typography color="text.secondary">
          {formatDate(race.date)}
          {race.location && ` · ${race.location}`}
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Aquí irán las inscripciones de la carrera.</Typography>
      </Paper>
    </Stack>
  );
}
