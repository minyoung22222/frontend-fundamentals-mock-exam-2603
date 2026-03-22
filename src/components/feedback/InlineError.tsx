import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

interface Props {
  message: string;
}

export function InlineError({ message }: Props) {
  return (
    <span css={css`color: ${colors.red500}; font-size: 14px;`} role="alert">
      {message}
    </span>
  );
}
