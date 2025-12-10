/**
 * Formate la durée en minutes vers un format lisible
 */
export function formatDuration(minutes: number | null | undefined): string {
  if (!minutes || minutes === 0) return '0min';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}min`;
}
