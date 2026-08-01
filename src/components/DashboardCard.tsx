import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface Props {
  label: string;
  value: string;
  icon: IconName;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
  style?: ViewStyle;
}

const DashboardCard = ({
  label,
  value,
  icon,
  iconColor = Colors.primary,
  iconBg = Colors.background,
  trend,
  trendUp,
  style,
}: Props) => (
  <View style={[styles.container, style]}>
    <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
      <Icon name={icon} size={26} color={iconColor} />
    </View>

    <AppText style={styles.value} numberOfLines={1}>
      {value}
    </AppText>

    <AppText style={styles.label} numberOfLines={1}>
      {label}
    </AppText>

    {trend ? (
      <View style={styles.trendRow}>
        <Icon
          name={trendUp ? 'trending-up' : 'trending-down'}
          size={14}
          color={trendUp ? Colors.success : Colors.error}
        />
        <AppText
          style={[styles.trend, { color: trendUp ? Colors.success : Colors.error }]}
        >
          {trend}
        </AppText>
      </View>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    flex: 1,
  },
  iconWrap: {
    width: 50,
    height: 50,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  value: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginBottom: 2,
    fontFamily: Typography.fontFamily,
  },
  label: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightMedium,
    fontFamily: Typography.fontFamily,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: Spacing.xs,
  },
  trend: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightMedium,
    fontFamily: Typography.fontFamily,
  },
});

export default memo(DashboardCard);
