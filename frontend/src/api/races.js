import { apiFetch } from './client';

export const listRaces = () => apiFetch('/races/');

export const getRace = (raceId) => apiFetch(`/races/${raceId}/`);

export const createRace = (race) => apiFetch('/races/', { method: 'POST', body: race });
