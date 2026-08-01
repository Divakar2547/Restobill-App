import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { CartItem } from '../types';
import { Colors, Spacing, Typography } from '../theme';
import AppText from './AppText';
import { formatCurrency } from '../utils';

interface Props {
  item: CartItem;
  currency?: string;
  index: number;
}

const ReceiptItem = ({ item, currency = '₹', index }: Props) => {
  const { product, quantity } = item;

  return (
    <View style={[styles.row, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
      <View style={styles.indexWrap}>
        <AppText style={styles.index}>{index + 1}</AppText>
      </View>

      <View style={styles.nameCol}>
        <AppText style={styles.name} numberOfLines={2}>{product.name}</AppText>
      </View>

      <View style={styles.qtyCol}>
        <AppText style={styles.qty}>x{quantity}</AppText>
      </View>

      <View style={styles.priceCol}>
        <AppText style={styles.unitPrice}>{formatCurrency(product.price, currency)}</AppText>
      </View>

      <View style={styles.totalCol}>
        <AppText style={styles.total}>{formatCurrency(product.price * quantity, currency)}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  rowEven: {
    backgroundColor: Colors.background,
  },
  rowOdd: {
    backgroundColor: Colors.surface,
  },
  indexWrap: {
    width: 20,
    alignItems: 'center',
  },
  index: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textMuted,
    fontWeight: Typography.fontWeightMedium,
  },
  nameCol: { flex: 2.5 },
  name: {
    fontSize: Typography.fontSizeSM,
    color: Colors.text,
    fontWeight: Typography.fontWeightMedium,
  },
  qtyCol: { width: 28, alignItems: 'center' },
  qty: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeightSemiBold,
  },
  priceCol: { flex: 1, alignItems: 'flex-end' },
  unitPrice: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textSecondary,
  },
  totalCol: { flex: 1.2, alignItems: 'flex-end' },
  total: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
  },
});

export default memo(ReceiptItem);
