import React, { memo } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { Colors, Typography } from '../theme';

interface Props {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const variantStyles: Record<string, TextStyle> = {
  h1: { fontFamily: Typography.fontFamily, fontSize: Typography.fontSize4XL, fontWeight: Typography.fontWeightExtraBold, color: Colors.text },
  h2: { fontFamily: Typography.fontFamily, fontSize: Typography.fontSize3XL, fontWeight: Typography.fontWeightBold, color: Colors.text },
  h3: { fontFamily: Typography.fontFamily, fontSize: Typography.fontSize2XL, fontWeight: Typography.fontWeightSemiBold, color: Colors.text },
  body: { fontFamily: Typography.fontFamily, fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightRegular, color: Colors.text },
  caption: { fontFamily: Typography.fontFamily, fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightRegular, color: Colors.textSecondary },
  label: { fontFamily: Typography.fontFamily, fontSize: Typography.fontSizeLG, fontWeight: Typography.fontWeightMedium, color: Colors.text },
};

const AppText = ({ children, variant = 'body', color, style, numberOfLines }: Props) => (
  <Text
    style={[variantStyles[variant], color ? { color } : null, style]}
    numberOfLines={numberOfLines}
  >
    {children}
  </Text>
);

export default memo(AppText);
