import { useQuery } from '@tanstack/react-query';
import { getReservations } from 'pages/remotes';
import { queryKeys } from './queryKeys';

export function useReservations(date: string) {
  return useQuery(queryKeys.reservations.byDate(date), () => getReservations(date), {
    enabled: !!date,
  });
}
