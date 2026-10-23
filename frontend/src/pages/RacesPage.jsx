import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { listRaces } from '../api/races';
import CreateRaceDialog from '../components/CreateRaceDialog';
import { formatDate } from '../utils/format';

export default function RacesPage() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    let ignore = false;
    listRaces()
      .then((data) => {
        if (!ignore) setRaces(data);
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
  }, []);

  const handleCreated = (race) => {
    setDialogOpen(false);
    navigate(`/races/${race.id}`);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          Carreras
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Nueva carrera
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          No se pudieron cargar las carreras: {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="Carreras">
            <TableHead>
              <TableRow>
                <TableCell>Carrera</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Lugar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {races.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No hay carreras. Crea la primera con «Nueva carrera».
                  </TableCell>
                </TableRow>
              )}
              {races.map((race) => (
                <TableRow key={race.id} hover>
                  <TableCell>
                    <Link component={RouterLink} to={`/races/${race.id}`} underline="hover">
                      {race.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDate(race.date)}</TableCell>
                  <TableCell>{race.location || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CreateRaceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
