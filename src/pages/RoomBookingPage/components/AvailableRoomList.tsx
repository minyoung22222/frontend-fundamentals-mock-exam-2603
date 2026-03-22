import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getServerErrorMessage } from 'utils/error';
import { useRooms } from 'queries/useRooms';
import { useCreateReservation } from '../queries/useCreateReservation';
import { useReservations } from 'queries/useReservations';
import { MESSAGES } from '../constants/messages';
import { filterAvailableRooms, sortRooms, formatRoomDescription } from '../utils/room';
import { HorizontalPadding } from 'components/layout/HorizontalPadding';
import { SectionTitle } from 'components/content/SectionTitle';
import { MessageBanner } from 'components/feedback/MessageBanner';
import { EmptyState } from 'components/feedback/EmptyState';
import { CardItem } from 'components/content/CardItem';
import { useBookingFilterParams } from '../hooks/useBookingFilterParams';

export function AvailableRoomList() {
  const navigate = useNavigate();

  const { date, startTime, endTime, attendees, equipment, preferredFloor } = useBookingFilterParams();

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filterKey = `${date}-${startTime}-${endTime}-${attendees}-${equipment.join(',')}-${preferredFloor}`;

  useEffect(() => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  }, [filterKey]);

  const hasTimeInputs = startTime !== '' && endTime !== '';
  const hasValidationError = hasTimeInputs && (endTime <= startTime || attendees < 1);
  const isFilterComplete = hasTimeInputs && !hasValidationError;

  const availableRooms = isFilterComplete
    ? sortRooms(filterAvailableRooms(rooms, { startTime, endTime, attendees, equipment, preferredFloor, reservations }))
    : [];

  const { mutateAsync: createReservation, isLoading: isCreatingReservation } = useCreateReservation();

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage(MESSAGES.booking.noRoomSelected);
      return;
    }

    try {
      const result = await createReservation({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: MESSAGES.booking.success } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? MESSAGES.booking.fail);
    } catch (err: unknown) {
      setErrorMessage(getServerErrorMessage(err, MESSAGES.booking.fail));
    }

    setSelectedRoomId(null);
  };

  if (!isFilterComplete) {
    return null;
  }

  if (availableRooms.length === 0) {
    return (
      <HorizontalPadding>
        <SectionTitle title="예약 가능 회의실" subtext="0개" />
        <Spacing size={16} />
        {errorMessage && (
          <>
            <MessageBanner type="error" text={errorMessage} />
            <Spacing size={12} />
          </>
        )}
        <EmptyState message={MESSAGES.booking.noAvailableRoom} />
        <Spacing size={16} />
        <Button display="full" onClick={handleBook} disabled={isCreatingReservation}>
          {isCreatingReservation ? '예약 중...' : '확정'}
        </Button>
      </HorizontalPadding>
    );
  }

  return (
    <HorizontalPadding>
      <SectionTitle title="예약 가능 회의실" subtext={`${availableRooms.length}개`} />
      <Spacing size={16} />
      {errorMessage && (
        <>
          <MessageBanner type="error" text={errorMessage} />
          <Spacing size={12} />
        </>
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 10px;
        `}
      >
        {availableRooms.map(
          (room: { id: string; name: string; floor: number; capacity: number; equipment: string[] }) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <CardItem
                key={room.id}
                isSelectable
                isSelected={isSelected}
                onClick={() => setSelectedRoomId(room.id)}
                ariaLabel={room.name}
                title={room.name}
                description={formatRoomDescription(room)}
                right={
                  isSelected ? (
                    <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                      선택됨
                    </Text>
                  ) : undefined
                }
              />
            );
          }
        )}
      </div>
      <Spacing size={16} />
      <Button display="full" onClick={handleBook} disabled={isCreatingReservation}>
        {isCreatingReservation ? '예약 중...' : '확정'}
      </Button>
    </HorizontalPadding>
  );
}
