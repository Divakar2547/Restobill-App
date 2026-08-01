import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { RootStackParamList, CartItem as CartItemType } from '../types';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setDiscount,
  setCustomerName,
  setTableNumber,
} from '../store/slices/cartSlice';
import { useCartCalculations } from '../hooks/useCartCalculations';
import { formatCurrency } from '../utils';
import AppText from '../components/AppText';
import CartItemComponent from '../components/CartItem';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import EmptyState from '../components/EmptyState';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const CartScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const { items, discount, customerName, tableNumber } = useAppSelector(s => s.cart);
  const { restaurantInfo } = useAppSelector(s => s.settings);
  const { subtotal, discountAmount, gstAmount, grandTotal, totalItems } = useCartCalculations();

  const currency = restaurantInfo.currency;

  const handleRemove = useCallback((id: string) => dispatch(removeFromCart(id)), [dispatch]);
  const handleIncrease = useCallback((id: string) => dispatch(increaseQuantity(id)), [dispatch]);
  const handleDecrease = useCallback((id: string) => dispatch(decreaseQuantity(id)), [dispatch]);

  const handleDiscountChange = useCallback(
    (text: string) => {
      const val = parseFloat(text);
      if (!isNaN(val)) dispatch(setDiscount(val));
      else if (text === '') dispatch(setDiscount(0));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({ item }: { item: CartItemType }) => (
      <CartItemComponent
        item={item}
        currency={currency}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />
    ),
    [currency, handleIncrease, handleDecrease, handleRemove],
  );

  if (items.length === 0) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
            <Icon name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <AppText variant="h3" style={styles.headerTitle}>Cart</AppText>
          <View style={styles.placeholder} />
        </View>
        <EmptyState
          icon="remove-shopping-cart"
          title="Your cart is empty"
          subtitle="Add items from the menu to get started"
          actionLabel="Browse Menu"
          onAction={() => navigation.navigate('Billing')}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText variant="h3" style={styles.headerTitle}>Cart</AppText>
          <AppText variant="caption">{totalItems} items</AppText>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Customer Info */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Order Details</AppText>
          <View style={styles.row}>
            <AppInput
              label="Customer Name"
              value={customerName}
              onChangeText={t => dispatch(setCustomerName(t))}
              placeholder="Enter name (optional)"
              containerStyle={styles.halfInput}
            />
            <AppInput
              label="Table Number"
              value={tableNumber}
              onChangeText={t => dispatch(setTableNumber(t))}
              placeholder="e.g. T-5"
              containerStyle={styles.halfInput}
            />
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Ordered Items</AppText>
          {items.map(item => (
            <CartItemComponent
              key={item.product.id}
              item={item}
              currency={currency}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
            />
          ))}
        </View>

        {/* Discount */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Discount</AppText>
          <AppInput
            label="Discount (%)"
            value={discount > 0 ? String(discount) : ''}
            onChangeText={handleDiscountChange}
            placeholder="Enter discount percentage"
            keyboardType="numeric"
            leftIcon={<Icon name="percent" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* Bill Summary */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Bill Summary</AppText>
          <View style={styles.summaryCard}>
            <BillRow label="Subtotal" value={formatCurrency(subtotal, currency)} />
            {discountAmount > 0 && (
              <BillRow
                label={`Discount (${discount}%)`}
                value={`-${formatCurrency(discountAmount, currency)}`}
                valueColor={Colors.success}
              />
            )}
            <BillRow
              label={`GST (${restaurantInfo.gstPercentage}%)`}
              value={formatCurrency(gstAmount, currency)}
              valueColor={Colors.textSecondary}
            />
            <View style={styles.divider} />
            <BillRow
              label="Grand Total"
              value={formatCurrency(grandTotal, currency)}
              isBold
              valueColor={Colors.primary}
            />
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Generate Bill Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <AppButton
          title={`Proceed to Payment  •  ${formatCurrency(grandTotal, currency)}`}
          onPress={() => navigation.navigate('Payment', { grandTotal })}
          size="lg"
          style={styles.payBtn}
          icon={<Icon name="payment" size={20} color={Colors.textInverse} />}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const BillRow = ({
  label,
  value,
  isBold,
  valueColor,
}: {
  label: string;
  value: string;
  isBold?: boolean;
  valueColor?: string;
}) => (
  <View style={billRowStyles.row}>
    <AppText style={[billRowStyles.label, isBold && billRowStyles.bold]}>{label}</AppText>
    <AppText style={[billRowStyles.value, isBold && billRowStyles.bold, valueColor ? { color: valueColor } : null]}>
      {value}
    </AppText>
  </View>
);

const billRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSizeMD,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: Typography.fontSizeMD,
    color: Colors.text,
  },
  bold: {
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeLG,
    color: Colors.text,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
  },
  placeholder: { width: 40 },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
    marginBottom: 0,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.md,
  },
  payBtn: {
    width: '100%',
    borderRadius: Radius.lg,
  },
  bottomSpacer: { height: Spacing.xxl },
});

export default CartScreen;
