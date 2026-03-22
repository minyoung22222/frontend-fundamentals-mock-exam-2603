import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

interface Props {
  children: React.ReactNode;
}

export function PageLayout({ children }: Props) {
  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      {children}
    </div>
  );
}
