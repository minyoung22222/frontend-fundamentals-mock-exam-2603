import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Props {
  value: string;
  min?: string;
  onChange: (value: string) => void;
  label?: string;
  ariaLabel?: string;
}

export function DateInput({ value, min, onChange, label, ariaLabel }: Props) {
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
      <input
        type="date"
        value={value}
        min={min}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel ?? label}
        css={css`
          box-sizing: border-box;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
          height: 48px;
          background-color: ${colors.grey50};
          border-radius: 12px;
          color: ${colors.grey800};
          width: 100%;
          border: 1px solid ${colors.grey200};
          padding: 0 16px;
          outline: none;
          transition: border-color 0.15s;
          &:focus {
            border-color: ${colors.blue500};
          }
        `}
      />
    </div>
  );
}
