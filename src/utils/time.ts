/** Date 객체를 "YYYY-MM-DD" 형식의 문자열로 변환합니다. */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** "HH:MM" 형식의 문자열을 자정(00:00) 기준 분으로 변환합니다. */
export function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);

  return hours * 60 + minutes;
}

/** startHour ~ endHour 범위의 시간대 목록을 30분 단위로 생성합니다. */
export function generateTimeSlots(startHour: number, endHour: number): string[] {
  const slots: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);

    if (hour < endHour) {
      slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }

  return slots;
}
