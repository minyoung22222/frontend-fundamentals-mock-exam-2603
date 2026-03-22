import { useSearchParam } from './useSearchParam';

export function useStartTimeParam() {
  return useSearchParam<string>({
    key: 'startTime',
    parse: raw => raw ?? '',
    serialize: value => value || null,
  });
}
