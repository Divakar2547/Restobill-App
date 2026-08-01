import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}

const AppHeader = ({ title, subtitle, onBack, rightComponent, transparent }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, transparent ? styles.transparent : styles.solid, { paddingTop: insets.top + Spacing.sm }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={Colors.textInverse} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.titleContainer}>
          <AppText variant="h3" style={styles.title}>{title}</AppText>
          {subtitle ? <AppText variant="caption" style={styles.subtitle}>{subtitle}</AppText> : null}
        </View>
        <View style={styles.right}>{rightComponent ?? <View style={styles.placeholder} />}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  solid: {
    backgroundColor: '#000000',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...Shadow.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: { flex: 1, alignItems: 'center' },
  title: {
    fontSize: Typography.fontSizeXL,
    color: Colors.textInverse,
    fontWeight: Typography.fontWeightBold,
  },
  subtitle: {
    color: Colors.textInverse,
    opacity: 0.8,
  },
  right: { width: 40, alignItems: 'flex-end' },
  placeholder: { width: 40 },
});

export default memo(AppHeader);
