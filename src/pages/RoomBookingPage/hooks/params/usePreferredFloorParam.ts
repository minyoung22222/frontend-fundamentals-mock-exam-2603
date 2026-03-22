import { useSearchParam } from './useSearchParam';

export function usePreferredFloorParam() {
  return useSearchParam<number | null>({
    key: 'floor',
    parse: raw => (raw != null ? Number(raw) : null),
    serialize: value => (value != null ? String(value) : null),
  });
}
