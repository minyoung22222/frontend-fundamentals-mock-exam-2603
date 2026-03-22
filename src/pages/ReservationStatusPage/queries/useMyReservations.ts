import { useQuery } from '@tanstack/react-query';
import { getMyReservations } from 'pages/remotes';
import { queryKeys } from 'queries/queryKeys';

export function useMyReservations() {
  return useQuery(queryKeys.myReservations(), getMyReservations);
}
