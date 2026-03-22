export const MESSAGES = {
  booking: {
    noRoomSelected: '회의실을 선택해주세요.',
    success: '예약이 완료되었습니다!',
    fail: '예약에 실패했습니다.',
    noAvailableRoom: '조건에 맞는 회의실이 없습니다.',
  },
  validation: {
    endTimeBeforeStart: '종료 시간은 시작 시간보다 늦어야 합니다.',
    attendeesMinimum: '참석 인원은 1명 이상이어야 합니다.',
  },
} as const;
