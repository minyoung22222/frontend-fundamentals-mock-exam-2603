import { css } from '@emotion/react';
import { ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface SelectableProps {
  isSelectable: true;
  isSelected: boolean;
  onClick: () => void;
  ariaLabel?: string;
}

interface StaticProps {
  isSelectable?: false;
  isSelected?: never;
  onClick?: never;
  ariaLabel?: never;
}

type Props = {
  title: string;
  description: string;
  right?: React.ReactNode;
} & (SelectableProps | StaticProps);

export function CardItem({ title, description, right, isSelectable, isSelected, onClick, ariaLabel }: Props) {
  if (isSelectable) {
    return (
      <div
        onClick={onClick}
        role="button"
        aria-pressed={isSelected}
        aria-label={ariaLabel}
        css={css`
          cursor: pointer;
          padding: 14px 16px;
          border-radius: 14px;
          border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
          background: ${isSelected ? colors.blue50 : colors.white};
          transition: all 0.15s;
          &:hover {
            border-color: ${isSelected ? colors.blue500 : colors.grey300};
          }
        `}
      >
        <ListRow
          contents={
            <ListRow.Text2Rows
              top={title}
              topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
              bottom={description}
              bottomProps={{ typography: 't7', color: colors.grey600 }}
            />
          }
          right={right}
        />
      </div>
    );
  }

  return (
    <div
      css={css`
        padding: 14px 16px;
        border-radius: 14px;
        background: ${colors.grey50};
        border: 1px solid ${colors.grey200};
      `}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={title}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={description}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={right}
      />
    </div>
  );
}
