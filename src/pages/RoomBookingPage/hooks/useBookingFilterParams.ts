import { useDateParam } from './params/useDateParam';
import { useStartTimeParam } from './params/useStartTimeParam';
import { useEndTimeParam } from './params/useEndTimeParam';
import { useAttendeesParam } from './params/useAttendeesParam';
import { useEquipmentParam } from './params/useEquipmentParam';
import { usePreferredFloorParam } from './params/usePreferredFloorParam';

export function useBookingFilterParams() {
  const [date, setDate] = useDateParam();
  const [startTime, setStartTime] = useStartTimeParam();
  const [endTime, setEndTime] = useEndTimeParam();
  const [attendees, setAttendees] = useAttendeesParam();
  const [equipment, setEquipment] = useEquipmentParam();
  const [preferredFloor, setPreferredFloor] = usePreferredFloorParam();

  return {
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
  };
}
