import { formatDate } from 'utils/time';
import { useSearchParam } from './useSearchParam';

export function useDateParam() {
  return useSearchParam<string>({
    key: 'date',
    parse: raw => raw ?? formatDate(new Date()),
    serialize: value => value,
  });
}
