import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const AppButton = ({ title, onPress, variant = 'primary', size = 'md', loading, disabled, style, textStyle, icon }: Props) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.textInverse : Colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <AppText
            style={[
              styles.text,
              styles[`text_${variant}`],
              styles[`textSize_${size}`],
              textStyle,
            ]}
          >
            {title}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.xl,
  },
  primary: {
    backgroundColor: Colors.primary,
    ...Shadow.lg,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  size_sm: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  size_md: { paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md + 2 },
  size_lg: { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg },
  disabled: { opacity: 0.5 },
  text: { fontWeight: Typography.fontWeightSemiBold, fontFamily: Typography.fontFamily },
  text_primary: { color: Colors.textInverse },
  text_secondary: { color: Colors.primaryDark },
  text_outline: { color: Colors.primary },
  text_ghost: { color: Colors.primary },
  textSize_sm: { fontSize: Typography.fontSizeSM },
  textSize_md: { fontSize: Typography.fontSizeMD },
  textSize_lg: { fontSize: Typography.fontSizeLG },
});

export default memo(AppButton);
