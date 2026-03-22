import { EQUIPMENT_LABELS } from 'constants/equipment';

interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
}

interface Reservation {
  roomId: string;
  start: string;
  end: string;
}

interface FilterOptions {
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
  reservations: Reservation[];
}

/** rooms 목록에서 중복 없이 정렬된 층 번호 목록을 추출한다 */
export function extractFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map(r => r.floor))].sort((a, b) => a - b);
}

/** 예약 가능한 회의실 목록을 필터링한다 */
export function filterAvailableRooms(rooms: Room[], options: FilterOptions): Room[] {
  const { startTime, endTime, attendees, equipment, preferredFloor, reservations } = options;

  return rooms.filter(room => {
    if (room.capacity < attendees) return false;
    if (!equipment.every(eq => room.equipment.includes(eq))) return false;
    if (preferredFloor !== null && room.floor !== preferredFloor) return false;

    const hasConflict = reservations.some(r => r.roomId === room.id && r.start < endTime && r.end > startTime);

    return !hasConflict;
  });
}

/** 회의실 목록을 층 → 이름 순으로 정렬한다 */
export function sortRooms(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => {
    if (a.floor !== b.floor) return a.floor - b.floor;

    return a.name.localeCompare(b.name);
  });
}

/** 회의실 설명 문자열을 생성한다 (예: "3층 · 6명 · TV, 화이트보드") */
export function formatRoomDescription(room: Room): string {
  const equipmentLabel = room.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ');

  return `${room.floor}층 · ${room.capacity}명 · ${equipmentLabel}`;
}
