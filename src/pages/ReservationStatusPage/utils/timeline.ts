import { parseTimeToMinutes } from 'utils/time';
import { TIMELINE_START_MINUTES, TOTAL_MINUTES } from '../constants/timeline';

/** 시각(HH:MM)을 타임라인 내 가로 위치(%)로 변환합니다. */
export function toTimelineLeft(time: string): number {
  return ((parseTimeToMinutes(time) - TIMELINE_START_MINUTES) / TOTAL_MINUTES) * 100;
}

/** 시작~종료 시각을 타임라인 내 너비(%)로 변환합니다. */
export function toTimelineWidth(start: string, end: string): number {
  return ((parseTimeToMinutes(end) - parseTimeToMinutes(start)) / TOTAL_MINUTES) * 100;
}
