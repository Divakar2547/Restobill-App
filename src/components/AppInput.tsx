import React, { memo } from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextInputProps } from 'react-native';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';

interface Props extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  containerStyle?: ViewStyle;
}

const AppInput = ({ label, leftIcon, rightIcon, error, containerStyle, style, ...rest }: Props) => (
  <View style={[styles.wrapper, containerStyle]}>
    {label ? <AppText variant="label" style={styles.label}>{label}</AppText> : null}
    <View style={[styles.inputRow, error ? styles.inputError : null]}>
      {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.textMuted}
        {...rest}
      />
      {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
    </View>
    {error ? <AppText variant="caption" color={Colors.error} style={styles.errorText}>{error}</AppText> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing.md },
  label: { marginBottom: Spacing.xs, color: Colors.textSecondary, fontFamily: Typography.fontFamily },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F1ED',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    ...Shadow.sm,
  },
  inputError: { borderColor: Colors.error },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSizeMD,
    color: Colors.text,
    fontFamily: Typography.fontFamily,
  },
  icon: { marginHorizontal: Spacing.xs },
  errorText: { marginTop: Spacing.xs },
});

export default memo(AppInput);
