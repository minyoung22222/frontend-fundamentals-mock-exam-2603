import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Props {
  title: string;
  subtext?: string;
}

export function SectionTitle({ title, subtext }: Props) {
  return (
    <div
      css={css`
        display: flex;
        align-items: baseline;
        gap: 6px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        {title}
      </Text>
      {subtext != null && (
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {subtext}
        </Text>
      )}
    </div>
  );
}
