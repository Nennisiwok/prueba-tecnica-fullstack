import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Route, Routes } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import RaceDetailPage from './pages/RaceDetailPage';
import RacesPage from './pages/RacesPage';

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <DirectionsRunIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}
          >
            Dorsal
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<RacesPage />} />
          <Route path="/races/:raceId" element={<RaceDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
