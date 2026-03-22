import { css } from '@emotion/react';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { formatDate } from 'utils/time';
import { EQUIPMENT_LABELS, ALL_EQUIPMENT } from 'constants/equipment';
import { useRooms } from 'queries/useRooms';
import { DateInput } from 'components/input/DateInput';
import { SelectInput } from 'components/input/SelectInput';
import { NumberInput } from 'components/input/NumberInput';
import { InlineError } from 'components/feedback/InlineError';
import { Chip } from 'components/input/Chip';
import { TIME_SLOTS } from '../constants/booking';
import { MESSAGES } from '../constants/messages';
import { extractFloors } from '../utils/room';
import { useBookingFilterParams } from '../hooks/useBookingFilterParams';

export function BookingFilterForm() {
  const { data: rooms = [] } = useRooms();

  const {
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    attendees,
    setAttendees,
    equipment,
    setEquipment,
    preferredFloor,
    setPreferredFloor,
  } = useBookingFilterParams();

  const floors = extractFloors(rooms);

  const hasTimeInputs = startTime !== '' && endTime !== '';

  function getValidationError(): string | null {
    if (!hasTimeInputs) return null;
    if (endTime <= startTime) return MESSAGES.validation.endTimeBeforeStart;
    if (attendees < 1) return MESSAGES.validation.attendeesMinimum;
    return null;
  }

  const validationError = getValidationError();

  return (
    <>
      <DateInput label="날짜" value={date} min={formatDate(new Date())} onChange={setDate} />
      <Spacing size={14} />

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
            onChange={v => setStartTime(v)}
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
            onChange={v => setEndTime(v)}
            options={[{ value: '', label: '선택' }, ...TIME_SLOTS.slice(1).map(t => ({ value: t, label: t }))]}
          />
        </div>
      </div>
      <Spacing size={14} />

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
          <NumberInput label="참석 인원" value={attendees} min={1} onChange={setAttendees} />
        </div>
        <div
          css={css`
            flex: 1;
          `}
        >
          <SelectInput
            label="선호 층"
            value={preferredFloor != null ? String(preferredFloor) : ''}
            onChange={v => setPreferredFloor(v ? Number(v) : null)}
            options={[{ value: '', label: '전체' }, ...floors.map(f => ({ value: String(f), label: `${f}층` }))]}
          />
        </div>
      </div>
      <Spacing size={14} />

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
              }}
            />
          ))}
        </div>
      </div>

      {validationError && (
        <>
          <Spacing size={8} />
          <InlineError message={validationError} />
        </>
      )}
    </>
  );
}
