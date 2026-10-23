import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listRaces } from '../api/races';
import RacesPage from './RacesPage';

vi.mock('../api/races', () => ({
  listRaces: vi.fn(),
  createRace: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <RacesPage />
    </MemoryRouter>,
  );
}

describe('RacesPage', () => {
  beforeEach(() => {
    vi.mocked(listRaces).mockReset();
  });

  it('muestra las carreras con un enlace a su detalle', async () => {
    vi.mocked(listRaces).mockResolvedValue([
      { id: 7, name: 'Media Maratón del Río', date: '2027-03-14', location: 'Zaragoza' },
    ]);

    renderPage();

    const link = await screen.findByRole('link', { name: 'Media Maratón del Río' });
    expect(link).toHaveAttribute('href', '/races/7');
    expect(screen.getByText('14/03/2027')).toBeInTheDocument();
  });

  it('avisa si no se pueden cargar las carreras', async () => {
    vi.mocked(listRaces).mockRejectedValue(new Error('Error 500'));

    renderPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('Error 500');
  });
});
