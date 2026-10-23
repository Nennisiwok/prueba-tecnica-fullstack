import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { createRace } from '../api/races';

const EMPTY_FORM = { name: '', date: '', location: '' };

export default function CreateRaceDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleClose = () => {
    setForm(EMPTY_FORM);
    setError(null);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const race = await createRace(form);
      setForm(EMPTY_FORM);
      onCreated(race);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nueva carrera</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Nombre"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
            <TextField
              label="Fecha"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Lugar"
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? 'Guardando…' : 'Crear carrera'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
