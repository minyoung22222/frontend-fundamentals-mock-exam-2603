import { Spacing } from '_tosslib/components';
import { PageLayout } from 'components/layout/PageLayout';
import { PageHeader } from 'components/layout/PageHeader';
import { HorizontalPadding } from 'components/layout/HorizontalPadding';
import { SectionDivider } from 'components/layout/SectionDivider';
import { BackButton } from 'components/layout/BackButton';
import { SectionTitle } from 'components/content/SectionTitle';
import { BookingFilterForm } from './components/BookingFilterForm';
import { AvailableRoomList } from './components/AvailableRoomList';

export function RoomBookingPage() {
  return (
    <PageLayout>
      <BackButton to="/" text="← 예약 현황으로" />
      <PageHeader>예약하기</PageHeader>
      <Spacing size={24} />

      <HorizontalPadding>
        <SectionTitle title="예약 조건" />
        <Spacing size={16} />
        <BookingFilterForm />
      </HorizontalPadding>

      <SectionDivider />

      <AvailableRoomList />

      <Spacing size={24} />
    </PageLayout>
  );
}
