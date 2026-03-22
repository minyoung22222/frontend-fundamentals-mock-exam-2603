import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spacing, Button } from '_tosslib/components';
import { useMyReservations } from './queries/useMyReservations';
import { useCancelReservation } from './queries/useCancelReservation';
import { formatDate } from 'utils/time';
import { PageLayout } from 'components/layout/PageLayout';
import { PageHeader } from 'components/layout/PageHeader';
import { HorizontalPadding } from 'components/layout/HorizontalPadding';
import { SectionDivider } from 'components/layout/SectionDivider';
import { SectionTitle } from 'components/content/SectionTitle';
import { MessageBanner } from 'components/feedback/MessageBanner';
import { DateInput } from 'components/input/DateInput';
import { ReservationTimeline } from './components/ReservationTimeline';
import { MyReservationList } from './components/MyReservationList';

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const { data: myReservationList = [] } = useMyReservations();
  const cancelMutation = useCancelReservation();

  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

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
        <ReservationTimeline date={date} />
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
        <MyReservationList reservations={myReservationList} onCancel={handleCancel} />
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
