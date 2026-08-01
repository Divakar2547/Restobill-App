import React, { memo } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder = 'Search food...' }: Props) => (
  <View style={styles.container}>
    <Icon name="search" size={20} color={Colors.textMuted} style={styles.icon} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
        <Icon name="close" size={18} color={Colors.textMuted} />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  icon: { marginRight: Spacing.sm },
  input: {
    flex: 1,
    fontSize: Typography.fontSizeMD,
    color: Colors.text,
    paddingVertical: 0,
  },
});

export default memo(SearchBar);
