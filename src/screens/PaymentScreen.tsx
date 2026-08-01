import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { RootStackParamList, PaymentMethod } from '../types';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { setPaymentMethod, setProcessing, resetPayment } from '../store/slices/paymentSlice';
import { addInvoice } from '../store/slices/invoiceSlice';
import { incrementInvoiceNumber } from '../store/slices/settingsSlice';
import { clearCart } from '../store/slices/cartSlice';
import { buildInvoice, formatCurrency } from '../utils';
import { StorageService } from '../services/StorageService';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { PAYMENT_METHODS } from '../constants';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'Payment'>;

type PaymentIconName = React.ComponentProps<typeof Icon>['name'];

const PAYMENT_ICONS: Record<PaymentMethod, PaymentIconName> = {
  Cash: 'payments',
  UPI: 'qr-code-scanner',
  'Credit Card': 'credit-card',
  'Debit Card': 'credit-card',
  Wallet: 'account-balance-wallet',
};

const PaymentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const dispatch = useAppDispatch();

  const { grandTotal } = route.params;
  const { selectedMethod, isProcessing } = useAppSelector(s => s.payment);
  const { restaurantInfo, lastInvoiceNumber } = useAppSelector(s => s.settings);
  const { items, discount, customerName, tableNumber } = useAppSelector(s => s.cart);
  const invoices = useAppSelector(s => s.invoice.invoices);

  const handleSelectMethod = useCallback(
    (method: PaymentMethod) => dispatch(setPaymentMethod(method)),
    [dispatch],
  );

  const handleConfirmPayment = useCallback(async () => {
    dispatch(setProcessing(true));

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const invoice = buildInvoice(
      items,
      discount,
      restaurantInfo.gstPercentage,
      selectedMethod,
      restaurantInfo,
      lastInvoiceNumber,
      customerName,
      tableNumber,
    );

    dispatch(addInvoice(invoice));
    dispatch(incrementInvoiceNumber());
    dispatch(clearCart());
    dispatch(resetPayment());

    const updatedInvoices = [invoice, ...invoices];
    await StorageService.saveInvoices(updatedInvoices);

    dispatch(setProcessing(false));

    navigation.replace('Receipt', { invoiceId: invoice.id });
  }, [
    dispatch, items, discount, restaurantInfo, selectedMethod,
    lastInvoiceNumber, customerName, tableNumber, invoices, navigation,
  ]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3" style={styles.headerTitle}>Payment</AppText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <AppText style={styles.amountLabel}>Total Amount</AppText>
          <AppText style={styles.amountValue}>
            {formatCurrency(grandTotal, restaurantInfo.currency)}
          </AppText>
          <AppText style={styles.amountSub}>Select your payment method below</AppText>
        </View>

        {/* Payment Methods */}
        <AppText style={styles.sectionTitle}>Payment Method</AppText>
        <View style={styles.methodsGrid}>
          {PAYMENT_METHODS.map(method => (
            <PaymentMethodCard
              key={method}
              method={method}
              icon={PAYMENT_ICONS[method]}
              isSelected={selectedMethod === method}
              onPress={handleSelectMethod}
            />
          ))}
        </View>

        {/* Selected Method Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>Paying via</AppText>
            <AppText style={styles.summaryValue}>{selectedMethod}</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>Amount</AppText>
            <AppText style={[styles.summaryValue, styles.summaryAmount]}>
              {formatCurrency(grandTotal, restaurantInfo.currency)}
            </AppText>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <AppButton
          title="Confirm Payment"
          onPress={handleConfirmPayment}
          size="lg"
          loading={isProcessing}
          style={styles.confirmBtn}
          icon={<Icon name="check-circle" size={20} color={Colors.textInverse} />}
        />
      </View>
    </View>
  );
};

const PaymentMethodCard = ({
  method,
  icon,
  isSelected,
  onPress,
}: {
  method: PaymentMethod;
  icon: React.ComponentProps<typeof Icon>['name'];
  isSelected: boolean;
  onPress: (m: PaymentMethod) => void;
}) => (
  <TouchableOpacity
    style={[styles.methodCard, isSelected && styles.methodCardSelected]}
    onPress={() => onPress(method)}
    activeOpacity={0.8}
  >
    <View style={[styles.methodIcon, isSelected && styles.methodIconSelected]}>
      <Icon name={icon} size={26} color={isSelected ? Colors.textInverse : Colors.primary} />
    </View>
    <AppText
      style={[styles.methodLabel, isSelected && styles.methodLabelSelected]}
      numberOfLines={2}
    >
      {method}
    </AppText>
    {isSelected && (
      <View style={styles.methodCheck}>
        <Icon name="check" size={14} color={Colors.textInverse} />
      </View>
    )}
  </TouchableOpacity>
);

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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
  },
  placeholder: { width: 40 },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 100,
  },
  amountCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    ...Shadow.lg,
  },
  amountLabel: {
    fontSize: Typography.fontSizeSM,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: Typography.fontWeightMedium,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.textInverse,
    marginBottom: Spacing.sm,
  },
  amountSub: {
    fontSize: Typography.fontSizeSM,
    color: 'rgba(255,255,255,0.6)',
  },
  sectionTitle: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  methodCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF3EE',
  },
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconSelected: {
    backgroundColor: Colors.primary,
  },
  methodLabel: {
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.text,
    textAlign: 'center',
  },
  methodLabelSelected: {
    color: Colors.primary,
  },
  methodCheck: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
    gap: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Typography.fontSizeMD,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.text,
  },
  summaryAmount: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.md,
  },
  confirmBtn: {
    width: '100%',
  },
  bottomSpacer: { height: Spacing.xxl },
});

export default PaymentScreen;
