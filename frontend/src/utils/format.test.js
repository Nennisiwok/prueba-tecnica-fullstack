import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('convierte fechas ISO a dd/mm/aaaa', () => {
    expect(formatDate('2027-03-14')).toBe('14/03/2027');
  });

  it('muestra un guion si no hay fecha', () => {
    expect(formatDate(null)).toBe('—');
  });
});
