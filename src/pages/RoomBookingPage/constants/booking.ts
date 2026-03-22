import { generateTimeSlots } from 'utils/time';

export const BOOKING_START_HOUR = 9;
export const BOOKING_END_HOUR = 20;
export const TIME_SLOTS = generateTimeSlots(BOOKING_START_HOUR, BOOKING_END_HOUR);
