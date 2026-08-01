import React, { memo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Radius, Spacing, Typography } from '../theme';
import AppText from './AppText';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

const QuantityButton = ({ quantity, onIncrease, onDecrease, size = 'md' }: Props) => {
  const btnSize = size === 'sm' ? 28 : 34;
  const iconSize = size === 'sm' ? 16 : 20;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrease}
        style={[styles.btn, styles.btnMinus, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 }]}
        activeOpacity={0.8}
      >
        <Icon name="remove" size={iconSize} color={Colors.primary} />
      </TouchableOpacity>

      <AppText
        style={[
          styles.qty,
          size === 'sm' ? styles.qtySm : styles.qtyMd,
        ]}
      >
        {quantity}
      </AppText>

      <TouchableOpacity
        onPress={onIncrease}
        style={[styles.btn, styles.btnPlus, { width: btnSize, height: btnSize, borderRadius: btnSize / 2 }]}
        activeOpacity={0.8}
      >
        <Icon name="add" size={iconSize} color={Colors.textInverse} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnMinus: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  btnPlus: {
    backgroundColor: Colors.primary,
  },
  qty: {
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  qtySm: { fontSize: Typography.fontSizeMD },
  qtyMd: { fontSize: Typography.fontSizeLG },
});

export default memo(QuantityButton);
