import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { colors } from '_tosslib/constants/colors';

interface Props {
  text: string;
  to?: string;
}

export function BackButton({ text, to = '/' }: Props) {
  const navigate = useNavigate();

  return (
    <div
      css={css`
        padding: 12px 24px 0;
      `}
    >
      <button
        type="button"
        onClick={() => navigate(to)}
        aria-label="뒤로가기"
        css={css`
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 14px;
          color: ${colors.grey600};
          &:hover {
            color: ${colors.grey900};
          }
        `}
      >
        {text}
      </button>
    </div>
  );
}
