/** 장비 코드 → 표시 이름 매핑 */
export const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

/** 예약 시 선택 가능한 장비 코드 목록 */
export const ALL_EQUIPMENT = Object.keys(EQUIPMENT_LABELS);
