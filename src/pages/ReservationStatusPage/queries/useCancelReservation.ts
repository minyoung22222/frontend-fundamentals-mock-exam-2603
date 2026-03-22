import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';
import { queryKeys } from 'queries/queryKeys';

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.reservations.all());
      queryClient.invalidateQueries(queryKeys.myReservations());
    },
  });
}
