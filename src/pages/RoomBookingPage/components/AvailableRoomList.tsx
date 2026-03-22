import { css } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import axios from 'axios';
import { useRooms } from 'queries/useRooms';
import { useCreateReservation } from '../queries/useCreateReservation';
import { useReservations } from 'queries/useReservations';
import { EQUIPMENT_LABELS } from 'constants/equipment';
import { HorizontalPadding } from 'components/layout/HorizontalPadding';
import { SectionTitle } from 'components/content/SectionTitle';
import { MessageBanner } from 'components/feedback/MessageBanner';
import { EmptyState } from 'components/feedback/EmptyState';
import { CardItem } from 'components/content/CardItem';

export function AvailableRoomList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const date = searchParams.get('date') ?? '';
  const startTime = searchParams.get('startTime') ?? '';
  const endTime = searchParams.get('endTime') ?? '';
  const attendees = Number(searchParams.get('attendees')) || 1;
  const equipmentRaw = searchParams.get('equipment') ?? '';
  const equipment = useMemo(() => equipmentRaw.split(',').filter(Boolean), [equipmentRaw]);
  const preferredFloor = searchParams.get('floor') != null ? Number(searchParams.get('floor')) : null;

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  }, [date, startTime, endTime, attendees, equipment, preferredFloor]);

  const hasTimeInputs = startTime !== '' && endTime !== '';
  const hasValidationError = hasTimeInputs && (endTime <= startTime || attendees < 1);
  const isFilterComplete = hasTimeInputs && !hasValidationError;

  const availableRooms = isFilterComplete
    ? rooms
        .filter((room: { id: string; capacity: number; equipment: string[]; floor: number }) => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;
          const hasConflict = reservations.some(
            (r: { roomId: string; start: string; end: string }) =>
              r.roomId === room.id && r.start < endTime && r.end > startTime
          );
          return !hasConflict;
        })
        .sort((a: { floor: number; name: string }, b: { floor: number; name: string }) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  const createMutation = useCreateReservation();

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  if (!isFilterComplete) return null;

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

      {availableRooms.length === 0 ? (
        <EmptyState message="조건에 맞는 회의실이 없습니다." />
      ) : (
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
                  description={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
                    .map(e => EQUIPMENT_LABELS[e])
                    .join(', ')}`}
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
      )}

      <Spacing size={16} />
      <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
        {createMutation.isLoading ? '예약 중...' : '확정'}
      </Button>
    </HorizontalPadding>
  );
}
