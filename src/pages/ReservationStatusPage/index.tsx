import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spacing, Button, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, getMyReservations, cancelReservation } from 'pages/remotes';
import { PageLayout } from 'components/layout/PageLayout';
import { PageHeader } from 'components/layout/PageHeader';
import { HorizontalPadding } from 'components/layout/HorizontalPadding';
import { SectionDivider } from 'components/layout/SectionDivider';
import { SectionTitle } from 'components/content/SectionTitle';
import { MessageBanner } from 'components/feedback/MessageBanner';
import { DateInput } from 'components/input/DateInput';
import { EmptyState } from 'components/feedback/EmptyState';
import { Tooltip } from 'components/feedback/Tooltip';
import { CardItem } from 'components/content/CardItem';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

const TIME_SLOTS: string[] = [];
for (let h = 9; h <= 20; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 20) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
  }
}

const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));
const TIMELINE_START = 9;
const TIMELINE_END = 20;
const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return (h - TIMELINE_START) * 60 + m;
}

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [date, setDate] = useState(formatDate(new Date()));

  const locationState = location.state as { message?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  useEffect(() => {
    if (locationState?.message) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);
  const { data: reservations = [] } = useQuery(['reservations', date], () => getReservations(date), {
    enabled: !!date,
  });
  const { data: myReservationList = [] } = useQuery(['myReservations'], getMyReservations);

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['myReservations']);
    },
  });

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return (
    <PageLayout>
      <PageHeader>회의실 예약</PageHeader>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <HorizontalPadding>
        <SectionTitle title="날짜 선택" />
        <Spacing size={16} />
        <DateInput value={date} min={formatDate(new Date())} onChange={setDate} ariaLabel="날짜" />
      </HorizontalPadding>

      <SectionDivider />

      {/* 예약 현황 타임라인 */}
      <HorizontalPadding>
        <SectionTitle title="예약 현황" />
        <Spacing size={16} />

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
                const left = (timeToMinutes(t) / TOTAL_MINUTES) * 100;
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
          {rooms.map((room: { id: string; name: string }, index: number) => {
            const roomReservations = reservations.filter((r: { roomId: string }) => r.roomId === room.id);
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
                  {roomReservations.map(
                    (res: { id: string; start: string; end: string; attendees: number; equipment: string[] }) => {
                      const left = (timeToMinutes(res.start) / TOTAL_MINUTES) * 100;
                      const width = ((timeToMinutes(res.end) - timeToMinutes(res.start)) / TOTAL_MINUTES) * 100;
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
                                <div>{res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ')}</div>
                              )}
                            </Tooltip>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </HorizontalPadding>

      <SectionDivider />

      {/* 메시지 배너 */}
      {message && (
        <HorizontalPadding>
          <MessageBanner type={message.type} text={message.text} />
          <Spacing size={12} />
        </HorizontalPadding>
      )}

      {/* 내 예약 목록 */}
      <HorizontalPadding>
        <SectionTitle
          title="내 예약"
          subtext={myReservationList.length > 0 ? `${myReservationList.length}건` : undefined}
        />
        <Spacing size={16} />

        {myReservationList.length === 0 ? (
          <EmptyState message="예약 내역이 없습니다." />
        ) : (
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 10px;
            `}
          >
            {myReservationList.map(
              (res: {
                id: string;
                roomId: string;
                date: string;
                start: string;
                end: string;
                attendees: number;
                equipment: string[];
              }) => (
                <CardItem
                  key={res.id}
                  title={getRoomName(res.roomId)}
                  description={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${
                    res.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
                  }`}
                  right={
                    <Button
                      type="danger"
                      style="weak"
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        if (window.confirm('정말 취소하시겠습니까?')) {
                          handleCancel(res.id);
                        }
                      }}
                    >
                      취소
                    </Button>
                  }
                />
              )
            )}
          </div>
        )}
      </HorizontalPadding>

      <SectionDivider />

      {/* 예약하기 버튼 */}
      <HorizontalPadding>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </HorizontalPadding>
      <Spacing size={24} />
    </PageLayout>
  );
}
