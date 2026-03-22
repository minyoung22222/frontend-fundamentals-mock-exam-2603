import { css } from '@emotion/react';

interface Props {
  children: React.ReactNode;
}

export function HorizontalPadding({ children }: Props) {
  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      {children}
    </div>
  );
}
