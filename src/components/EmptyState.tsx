import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme';
import AppText from './AppText';
import AppButton from './AppButton';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface Props {
  icon?: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({ icon = 'inbox', title, subtitle, actionLabel, onAction }: Props) => (
  <View style={styles.container}>
    <View style={styles.iconWrap}>
      <Icon name={icon} size={64} color={Colors.textMuted} />
    </View>

    <AppText variant="h3" style={styles.title}>
      {title}
    </AppText>

    {subtitle ? (
      <AppText variant="caption" style={styles.subtitle}>
        {subtitle}
      </AppText>
    ) : null}

    {actionLabel && onAction ? (
      <AppButton
        title={actionLabel}
        onPress={onAction}
        size="md"
        style={styles.btn}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
    flex: 1,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: Typography.fontSizeXL,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  btn: {
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.md,
  },
});

export default memo(EmptyState);
