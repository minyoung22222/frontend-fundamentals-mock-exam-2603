import { useSearchParam } from './useSearchParam';

export function useEndTimeParam() {
  return useSearchParam<string>({
    key: 'endTime',
    parse: raw => raw ?? '',
    serialize: value => value || null,
  });
}
