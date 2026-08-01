import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Category } from '../types';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';

interface Props {
  category: Category;
  isSelected: boolean;
  onPress: (id: string) => void;
}

const CategoryCard = ({ category, isSelected, onPress }: Props) => (
  <TouchableOpacity
    onPress={() => onPress(category.id)}
    activeOpacity={0.8}
    style={[
      styles.container,
      isSelected ? styles.selected : styles.unselected,
    ]}
  >
    <View
      style={[
        styles.iconWrap,
        {
          backgroundColor: isSelected ? 'rgba(255,255,255,0.22)' : category.color,
        },
      ]}
    >
      <Icon
        name={category.icon}
        size={20}
        color={isSelected ? Colors.textInverse : Colors.primary}
      />
    </View>
    <AppText
      style={[
        styles.label,
        isSelected ? styles.labelSelected : styles.labelDefault,
      ]}
      numberOfLines={1}
    >
      {category.name}
    </AppText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.full,
    marginRight: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.xs,
    ...Shadow.sm,
  },
  selected: {
    backgroundColor: Colors.primary,
  },
  unselected: {
    backgroundColor: Colors.secondaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
    includeFontPadding: false,
  },
  labelSelected: { color: Colors.textInverse },
  labelDefault: { color: Colors.text },
});

export default memo(CategoryCard);
