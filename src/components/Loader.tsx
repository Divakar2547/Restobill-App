import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../theme';
import AppText from './AppText';

interface Props {
  message?: string;
  fullScreen?: boolean;
}

const Loader = ({ message, fullScreen = false }: Props) => (
  <View style={[styles.container, fullScreen && styles.fullScreen]}>
    <ActivityIndicator size="large" color={Colors.primary} />
    {message ? (
      <AppText variant="caption" style={styles.message}>
        {message}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  message: {
    marginTop: Spacing.sm,
  },
});

export default memo(Loader);
