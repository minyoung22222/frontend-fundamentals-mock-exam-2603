import { css } from '@emotion/react';
import { Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  ariaLabel?: string;
  options?: Option[];
  children?: React.ReactNode;
}

export function SelectInput({ value, onChange, label, ariaLabel, options, children }: Props) {
  return (
    <div
      css={
        label != null
          ? css`
              display: flex;
              flex-direction: column;
              gap: 6px;
            `
          : undefined
      }
    >
      {label != null && (
        <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
          {label}
        </Text>
      )}
      <Select value={value} onChange={e => onChange(e.target.value)} aria-label={ariaLabel ?? label}>
        {options != null
          ? options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          : children}
      </Select>
    </div>
  );
}
