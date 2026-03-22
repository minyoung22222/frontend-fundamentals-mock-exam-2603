import { generateTimeSlots } from 'utils/time';

export const TIMELINE_START = 9;
export const TIMELINE_END = 20;
export const TOTAL_MINUTES = (TIMELINE_END - TIMELINE_START) * 60;
export const TIMELINE_START_MINUTES = TIMELINE_START * 60;

const TIME_SLOTS = generateTimeSlots(TIMELINE_START, TIMELINE_END);
export const HOUR_LABELS = TIME_SLOTS.filter(t => t.endsWith(':00'));
