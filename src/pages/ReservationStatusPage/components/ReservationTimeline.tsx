import { css } from '@emotion/react';
import { useState } from 'react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useRooms } from 'queries/useRooms';
import { useReservations } from 'queries/useReservations';
import { EQUIPMENT_LABELS } from 'constants/equipment';
import { Tooltip } from 'components/feedback/Tooltip';
import { HOUR_LABELS } from '../constants/timeline';
import { toTimelineLeft, toTimelineWidth } from '../utils/timeline';

interface Props {
  date: string;
}

export function ReservationTimeline({ date }: Props) {
  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  return (
    <div
      css={css`
        background: ${colors.grey50};
        border-radius: 14px;
        padding: 16px;
      `}
    >
      {/* 시간 헤더 */}
      <div
        css={css`
          display: flex;
          align-items: flex-end;
          margin-bottom: 8px;
        `}
      >
        <div
          css={css`
            width: 80px;
            flex-shrink: 0;
            padding-right: 8px;
          `}
        />
        <div
          css={css`
            flex: 1;
            position: relative;
            height: 18px;
          `}
        >
          {HOUR_LABELS.map(t => {
            const left = toTimelineLeft(t);
            return (
              <Text
                key={t}
                typography="t7"
                fontWeight="regular"
                color={colors.grey400}
                css={css`
                  position: absolute;
                  left: ${left}%;
                  transform: translateX(-50%);
                  font-size: 10px;
                  letter-spacing: -0.3px;
                `}
              >
                {t.slice(0, 2)}
              </Text>
            );
          })}
        </div>
      </div>

      {/* 회의실별 타임라인 */}
      {rooms.map((room, index) => {
        const roomReservations = reservations.filter(r => r.roomId === room.id);
        return (
          <div
            key={room.id}
            css={css`
              display: flex;
              align-items: center;
              height: 32px;
              ${index > 0 ? 'margin-top: 4px;' : ''}
            `}
          >
            <div
              css={css`
                width: 80px;
                flex-shrink: 0;
                padding-right: 8px;
              `}
            >
              <Text
                typography="t7"
                fontWeight="medium"
                color={colors.grey700}
                ellipsisAfterLines={1}
                css={css`
                  font-size: 12px;
                `}
              >
                {room.name}
              </Text>
            </div>
            <div
              css={css`
                flex: 1;
                height: 24px;
                background: ${colors.white};
                border-radius: 6px;
                position: relative;
                overflow: visible;
              `}
            >
              {roomReservations.map(res => {
                const left = toTimelineLeft(res.start);
                const width = toTimelineWidth(res.start, res.end);
                const isActive = activeReservation === res.id;
                return (
                  <div
                    key={res.id}
                    css={css`
                      position: absolute;
                      left: ${left}%;
                      width: ${width}%;
                      height: 100%;
                    `}
                  >
                    <div
                      role="button"
                      aria-label={`${room.name} ${res.start}-${res.end} 예약 상세`}
                      onClick={() => setActiveReservation(isActive ? null : res.id)}
                      css={css`
                        width: 100%;
                        height: 100%;
                        background: ${colors.blue400};
                        border-radius: 4px;
                        opacity: ${isActive ? 1 : 0.75};
                        cursor: pointer;
                        transition: opacity 0.15s;
                        &:hover {
                          opacity: 1;
                        }
                      `}
                    />
                    {isActive && (
                      <Tooltip>
                        <div>
                          {res.start} ~ {res.end}
                        </div>
                        <div>{res.attendees}명</div>
                        {res.equipment.length > 0 && (
                          <div>{res.equipment.map(e => EQUIPMENT_LABELS[e]).join(', ')}</div>
                        )}
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
