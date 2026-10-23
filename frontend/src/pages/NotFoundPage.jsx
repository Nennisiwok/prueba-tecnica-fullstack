import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', py: 8 }}>
      <Typography variant="h4" component="h1">
        Página no encontrada
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Volver a las carreras
      </Button>
    </Stack>
  );
}
