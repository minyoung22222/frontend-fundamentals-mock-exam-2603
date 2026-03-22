import { css } from '@emotion/react';
import { Top } from '_tosslib/components';

interface Props {
  children: React.ReactNode;
}

export function PageHeader({ children }: Props) {
  return (
    <Top.Top03
      css={css`
        padding-left: 24px;
        padding-right: 24px;
      `}
    >
      {children}
    </Top.Top03>
  );
}
