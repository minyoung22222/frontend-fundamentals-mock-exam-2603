import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

interface Props {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function Chip({ label, isSelected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={isSelected}
      css={css`
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid ${isSelected ? colors.blue500 : colors.grey200};
        background: ${isSelected ? colors.blue50 : colors.grey50};
        color: ${isSelected ? colors.blue600 : colors.grey700};
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
        &:hover {
          border-color: ${isSelected ? colors.blue500 : colors.grey400};
        }
      `}
    >
      {label}
    </button>
  );
}
