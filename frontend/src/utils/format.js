// Las fechas llegan de la API como 'YYYY-MM-DD'. Se formatean sin pasar por Date
// para no depender de la zona horaria del navegador.
export function formatDate(isoDate) {
  if (!isoDate) return '—';
  const [year, month, day] = isoDate.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export function formatDateTime(isoDateTime) {
  if (!isoDateTime) return '—';
  return new Date(isoDateTime).toLocaleString('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
