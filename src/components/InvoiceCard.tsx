import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Invoice } from '../types';
import { Colors, Radius, Spacing, Typography, Shadow } from '../theme';
import AppText from './AppText';
import { formatCurrency } from '../utils';

interface Props {
  invoice: Invoice;
  onPress: (invoice: Invoice) => void;
}

const InvoiceCard = ({ invoice, onPress }: Props) => {
  const getPaymentIcon = () => {
    switch (invoice.paymentMethod) {
      case 'Cash': return 'payments';
      case 'UPI': return 'qr-code-scanner';
      case 'Credit Card': return 'credit-card';
      case 'Debit Card': return 'credit-card';
      case 'Wallet': return 'account-balance-wallet';
      default: return 'payment';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(invoice)}
      activeOpacity={0.8}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Icon name="receipt" size={24} color={Colors.primary} />
        </View>

        <View style={styles.headerContent}>
          <AppText variant="label" style={styles.invoiceNum}>
            {invoice.invoiceNumber}
          </AppText>
          <AppText variant="caption" style={styles.dateTime}>
            {invoice.date} • {invoice.time}
          </AppText>
        </View>

        <View style={styles.amountWrap}>
          <AppText style={styles.amount}>
            {formatCurrency(invoice.grandTotal, invoice.restaurantInfo.currency)}
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.paymentRow}>
          <Icon name={getPaymentIcon()} size={16} color={Colors.textSecondary} />
          <AppText variant="caption" style={styles.paymentText}>
            {invoice.paymentMethod}
          </AppText>
        </View>

        <View style={styles.itemsRow}>
          <Icon name="shopping-basket" size={16} color={Colors.textSecondary} />
          <AppText variant="caption" style={styles.itemsText}>
            {invoice.items.length} {invoice.items.length === 1 ? 'item' : 'items'}
          </AppText>
        </View>

        <Icon name="chevron-right" size={20} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 2,
  },
  invoiceNum: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
  },
  dateTime: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textMuted,
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  paymentText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  itemsText: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
  },
});

export default memo(InvoiceCard);
