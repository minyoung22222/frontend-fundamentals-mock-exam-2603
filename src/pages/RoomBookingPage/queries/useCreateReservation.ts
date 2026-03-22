import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';
import { queryKeys } from 'queries/queryKeys';

interface CreateReservationParams {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation(
    (data: CreateReservationParams) => createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(queryKeys.reservations.byDate(variables.date));
        queryClient.invalidateQueries(queryKeys.myReservations());
      },
    }
  );
}
