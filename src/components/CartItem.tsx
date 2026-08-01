import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { CartItem as CartItemType } from '../types';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';
import QuantityButton from './QuantityButton';
import { formatCurrency } from '../utils';

interface Props {
  item: CartItemType;
  currency?: string;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ item, currency = '₹', onIncrease, onDecrease, onRemove }: Props) => {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText variant="label" numberOfLines={1} style={styles.name}>
            {product.name}
          </AppText>
          <TouchableOpacity
            onPress={() => onRemove(product.id)}
            style={styles.deleteBtn}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="delete-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>

        <AppText variant="caption" numberOfLines={1}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </AppText>

        <View style={styles.bottomRow}>
          <AppText style={styles.total}>
            {formatCurrency(itemTotal, currency)}
          </AppText>
          <QuantityButton
            quantity={quantity}
            onIncrease={() => onIncrease(product.id)}
            onDecrease={() => onDecrease(product.id)}
            size="sm"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    alignItems: 'center',
    gap: Spacing.md,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    marginRight: Spacing.sm,
  },
  deleteBtn: {
    padding: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  total: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
});

export default memo(CartItem);
