import { css } from '@emotion/react';
import { Button } from '_tosslib/components';
import { useRooms } from 'queries/useRooms';
import { EQUIPMENT_LABELS } from 'constants/equipment';
import { EmptyState } from 'components/feedback/EmptyState';
import { CardItem } from 'components/content/CardItem';

interface Reservation {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
}

interface Props {
  reservations: Reservation[];
  onCancel: (id: string) => void;
}

export function MyReservationList({ reservations, onCancel }: Props) {
  const { data: rooms = [] } = useRooms();

  const getRoomName = (roomId: string) =>
    rooms.find((room: { id: string; name: string }) => room.id === roomId)?.name ?? roomId;

  if (reservations.length === 0) {
    return <EmptyState message="예약 내역이 없습니다." />;
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 10px;
      `}
    >
      {reservations.map(res => (
        <CardItem
          key={res.id}
          title={getRoomName(res.roomId)}
          description={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
            res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
          }`}
          right={
            <Button
              type="danger"
              style="weak"
              size="small"
              onClick={e => {
                e.stopPropagation();
                if (window.confirm('정말 취소하시겠습니까?')) {
                  onCancel(res.id);
                }
              }}
            >
              취소
            </Button>
          }
        />
      ))}
    </div>
  );
}
