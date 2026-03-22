import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, createReservation } from 'pages/remotes';
import axios from 'axios';
import { formatDate, generateTimeSlots } from 'utils/time';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT } from 'constants/equipment';
import { PageLayout } from 'components/layout/PageLayout';
import { PageHeader } from 'components/layout/PageHeader';
import { HorizontalPadding } from 'components/layout/HorizontalPadding';
import { SectionDivider } from 'components/layout/SectionDivider';
import { BackButton } from 'components/layout/BackButton';
import { SectionTitle } from 'components/content/SectionTitle';
import { MessageBanner } from 'components/feedback/MessageBanner';
import { DateInput } from 'components/input/DateInput';
import { SelectInput } from 'components/input/SelectInput';
import { NumberInput } from 'components/input/NumberInput';
import { EmptyState } from 'components/feedback/EmptyState';
import { InlineError } from 'components/feedback/InlineError';
import { Chip } from 'components/input/Chip';
import { CardItem } from 'components/content/CardItem';


const BOOKING_START_HOUR = 9;
const BOOKING_END_HOUR = 20;
const TIME_SLOTS = generateTimeSlots(BOOKING_START_HOUR, BOOKING_END_HOUR);

export function RoomBookingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<string[]>(
    searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : []
  );
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);
  const { data: reservations = [] } = useQuery(['reservations', date], () => getReservations(date), {
    enabled: !!date,
  });

  const createMutation = useMutation(
    (data: { roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) =>
      createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(['reservations', variables.date]);
        queryClient.invalidateQueries(['myReservations']);
      },
    }
  );

  // 필터 변경 시 선택 초기화
  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  // 입력 검증
  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  // 필터링
  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);

  const availableRooms = isFilterComplete
    ? rooms
        .filter((room: { id: string; capacity: number; equipment: string[]; floor: number }) => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;
          const hasConflict = reservations.some(
            (r: { roomId: string; date: string; start: string; end: string }) =>
              r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
          );
          if (hasConflict) return false;
          return true;
        })
        .sort((a: { floor: number; name: string }, b: { floor: number; name: string }) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
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

  return (
    <PageLayout>
      <BackButton to="/" text="← 예약 현황으로" />
      <PageHeader>예약하기</PageHeader>

      {errorMessage && (
        <HorizontalPadding>
          <Spacing size={12} />
          <MessageBanner type="error" text={errorMessage} />
        </HorizontalPadding>
      )}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <HorizontalPadding>
        <SectionTitle title="예약 조건" />
        <Spacing size={16} />

        <DateInput
          label="날짜"
          value={date}
          min={formatDate(new Date())}
          onChange={v => {
            setDate(v);
            handleFilterChange();
          }}
        />
        <Spacing size={14} />

        {/* 시간 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              flex: 1;
            `}
          >
            <SelectInput
              label="시작 시간"
              value={startTime}
              onChange={v => {
                setStartTime(v);
                handleFilterChange();
              }}
              options={[{ value: '', label: '선택' }, ...TIME_SLOTS.slice(0, -1).map(t => ({ value: t, label: t }))]}
            />
          </div>
          <div
            css={css`
              flex: 1;
            `}
          >
            <SelectInput
              label="종료 시간"
              value={endTime}
              onChange={v => {
                setEndTime(v);
                handleFilterChange();
              }}
              options={[{ value: '', label: '선택' }, ...TIME_SLOTS.slice(1).map(t => ({ value: t, label: t }))]}
            />
          </div>
        </div>
        <Spacing size={14} />

        {/* 참석 인원 + 선호 층 */}
        <div
          css={css`
            display: flex;
            gap: 12px;
          `}
        >
          <div
            css={css`
              flex: 1;
            `}
          >
            <NumberInput
              label="참석 인원"
              value={attendees}
              min={1}
              onChange={v => {
                setAttendees(Math.max(1, v));
                handleFilterChange();
              }}
            />
          </div>
          <div
            css={css`
              flex: 1;
            `}
          >
            <SelectInput
              label="선호 층"
              value={preferredFloor != null ? String(preferredFloor) : ''}
              onChange={v => {
                setPreferredFloor(v === '' ? null : Number(v));
                handleFilterChange();
              }}
              options={[
                { value: '', label: '전체' },
                ...floors.map((f: number) => ({ value: String(f), label: `${f}층` })),
              ]}
            />
          </div>
        </div>
        <Spacing size={14} />

        {/* 장비 */}
        <div>
          <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
            필요 장비
          </Text>
          <Spacing size={8} />
          <div
            css={css`
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            `}
          >
            {ALL_EQUIPMENT.map(eq => (
              <Chip
                key={eq}
                label={EQUIPMENT_LABELS[eq]}
                isSelected={equipment.includes(eq)}
                onClick={() => {
                  const next = equipment.includes(eq) ? equipment.filter(e => e !== eq) : [...equipment, eq];
                  setEquipment(next);
                  handleFilterChange();
                }}
              />
            ))}
          </div>
        </div>
      </HorizontalPadding>

      {validationError && (
        <HorizontalPadding>
          <Spacing size={8} />
          <InlineError message={validationError} />
        </HorizontalPadding>
      )}

      <SectionDivider />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <HorizontalPadding>
          <SectionTitle title="예약 가능 회의실" subtext={`${availableRooms.length}개`} />
          <Spacing size={16} />

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
                        .map((e: string) => EQUIPMENT_LABELS[e])
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
      )}

      <Spacing size={24} />
    </PageLayout>
  );
}
