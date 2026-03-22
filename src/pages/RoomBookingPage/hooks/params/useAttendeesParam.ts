import { useSearchParam } from './useSearchParam';

export function useAttendeesParam() {
  return useSearchParam<number>({
    key: 'attendees',
    parse: raw => Number(raw) || 1,
    serialize: value => (value > 1 ? String(value) : null),
  });
}
