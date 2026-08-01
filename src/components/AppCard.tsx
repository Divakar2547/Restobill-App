import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'flat' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const AppCard = ({ children, style, variant = 'default', padding = 'md' }: Props) => (
  <View
    style={[
      styles.base,
      styles[variant],
      styles[`pad_${padding}`],
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
  },
  default: {
    ...Shadow.md,
  },
  flat: {
    backgroundColor: Colors.background,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pad_none: { padding: 0 },
  pad_sm: { padding: Spacing.sm },
  pad_md: { padding: Spacing.lg },
  pad_lg: { padding: Spacing.xxl },
});

export default memo(AppCard);
