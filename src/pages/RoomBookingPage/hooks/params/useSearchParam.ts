import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseSearchParamOptions<T> {
  key: string;
  parse: (raw: string | null) => T;
  serialize: (value: T) => string | null;
}

export function useSearchParam<T>({ key, parse, serialize }: UseSearchParamOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = parse(searchParams.get(key));

  const setValue = useCallback(
    (next: T) => {
      setSearchParams(
        prev => {
          const updated = new URLSearchParams(prev);
          const serialized = serialize(next);

          if (serialized != null) {
            updated.set(key, serialized);
            return updated;
          }

          updated.delete(key);
          return updated;
        },
        { replace: true }
      );
    },
    [key, serialize, setSearchParams]
  );

  return [value, setValue] as const;
}
