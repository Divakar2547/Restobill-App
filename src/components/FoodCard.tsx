import React, { memo } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Product } from '../types';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';
import QuantityButton from './QuantityButton';
import { formatCurrency } from '../utils';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { decreaseQuantity, increaseQuantity } from '../store/slices/cartSlice';

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  currency?: string;
}

const FoodCard = ({ product, onAdd, currency }: Props) => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(s => s.cart.items.find(i => i.product.id === product.id));
  const cur = currency ?? '₹';

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      {product.isPopular && (
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>Popular</AppText>
        </View>
      )}
      <View style={styles.body}>
        <AppText variant="label" numberOfLines={1} style={styles.name}>{product.name}</AppText>
        <AppText variant="caption" numberOfLines={1}>{product.description}</AppText>
        <View style={styles.row}>
          <Icon name="star" size={12} color={Colors.warning} />
          <AppText style={styles.rating}>{product.rating}</AppText>
        </View>
        <View style={styles.footer}>
          <AppText style={styles.price}>{formatCurrency(product.price, cur)}</AppText>

          {cartItem ? (
            <QuantityButton
              quantity={cartItem.quantity}
              size="sm"
              onIncrease={() => dispatch(increaseQuantity(product.id))}
              onDecrease={() => dispatch(decreaseQuantity(product.id))}
            />
          ) : (
            <TouchableOpacity
              onPress={() => onAdd(product)}
              style={styles.addBtn}
              activeOpacity={0.8}
            >
              <Icon name="add" size={18} color={Colors.textInverse} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
    flex: 1,
    margin: Spacing.xs,
  },
  image: { width: '100%', height: 110 },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { color: Colors.textInverse, fontSize: 9, fontWeight: Typography.fontWeightBold, fontFamily: Typography.fontFamily },
  body: { padding: Spacing.sm },
  name: { fontSize: Typography.fontSizeMD, marginBottom: 2, fontFamily: Typography.fontFamily },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  rating: { fontSize: 11, color: Colors.textSecondary, marginLeft: 2, fontFamily: Typography.fontFamily },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: Spacing.sm },
  price: { fontSize: Typography.fontSizeMD, fontWeight: Typography.fontWeightBold, color: Colors.primary, fontFamily: Typography.fontFamily },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default memo(FoodCard);
