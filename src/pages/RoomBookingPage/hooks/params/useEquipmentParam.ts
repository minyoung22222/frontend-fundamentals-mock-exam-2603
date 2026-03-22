import { useSearchParam } from './useSearchParam';

export function useEquipmentParam() {
  return useSearchParam<string[]>({
    key: 'equipment',
    parse: raw => raw?.split(',').filter(Boolean) ?? [],
    serialize: value => (value.length > 0 ? value.join(',') : null),
  });
}
