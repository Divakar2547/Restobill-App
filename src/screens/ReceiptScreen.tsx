import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Share,
  Alert,
  Image,
} from 'react-native';
import { Asset } from 'expo-asset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { useAppSelector } from '../hooks/useRedux';
import { formatCurrency } from '../utils';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import ReceiptItem from '../components/ReceiptItem';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type RouteType = RouteProp<RootStackParamList, 'Receipt'>;

const ReceiptScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();

  const { invoiceId } = route.params;
  const invoice = useAppSelector(s =>
    s.invoice.invoices.find(inv => inv.id === invoiceId),
  );

  const handleShare = useCallback(async () => {
    if (!invoice) return;
    const info = invoice.restaurantInfo;
    const itemLines = invoice.items
      .map(
        (item, i) =>
          `${i + 1}. ${item.product.name} x${item.quantity}  ${formatCurrency(
            item.product.price * item.quantity,
            info.currency,
          )}`,
      )
      .join('\n');

    const text = `
=================================
  ${info.name}
  ${info.address}
  Ph: ${info.phone}
  GST: ${info.gstNumber}
=================================
  Invoice: ${invoice.invoiceNumber}
  Date: ${invoice.date}  Time: ${invoice.time}
  ${invoice.customerName ? `Customer: ${invoice.customerName}` : ''}
  ${invoice.tableNumber ? `Table: ${invoice.tableNumber}` : ''}
---------------------------------
${itemLines}
---------------------------------
  Subtotal:     ${formatCurrency(invoice.subtotal, info.currency)}
  ${invoice.discountAmount > 0 ? `Discount (${invoice.discount}%): -${formatCurrency(invoice.discountAmount, info.currency)}` : ''}
  GST (${invoice.gst}%):     ${formatCurrency(invoice.gstAmount, info.currency)}
  GRAND TOTAL:  ${formatCurrency(invoice.grandTotal, info.currency)}
---------------------------------
  Payment: ${invoice.paymentMethod}
=================================
  ${info.receiptFooter}
=================================
    `.trim();

    try {
      const shareAsset = Asset.fromModule(require('../../assets/logo.png'));
      await shareAsset.downloadAsync();
      const sharePayload: {
        message: string;
        title: string;
        url?: string;
      } = {
        message: text,
        title: `Receipt - ${invoice.invoiceNumber}`,
      };

      if (shareAsset.localUri || shareAsset.uri) {
        sharePayload.url = shareAsset.localUri || shareAsset.uri;
      }

      await Share.share(sharePayload);
    } catch {
      try {
        await Share.share({
          message: text,
          title: `Receipt - ${invoice.invoiceNumber}`,
        });
      } catch {
        Alert.alert('Error', 'Could not share receipt');
      }
    }
  }, [invoice]);

  if (!invoice) {
    return (
      <View style={styles.root}>
        <AppText>Receipt not found</AppText>
      </View>
    );
  }

  const info = invoice.restaurantInfo;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <AppText variant="h3" style={styles.headerTitle}>Receipt</AppText>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.7}>
          <Icon name="share" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={52} color={Colors.success} />
          </View>
          <AppText style={styles.successTitle}>Payment Successful!</AppText>
          <AppText style={styles.successSub}>
            {formatCurrency(invoice.grandTotal, info.currency)} paid via {invoice.paymentMethod}
          </AppText>
        </View>

        {/* Receipt Paper */}
        <View style={styles.receipt}>
          {/* Restaurant Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.logoWrap}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <AppText style={styles.restName}>{info.name}</AppText>
            <AppText style={styles.restAddress}>{info.address}</AppText>
            <AppText style={styles.restContact}>
              {info.phone}  |  GST: {info.gstNumber}
            </AppText>
          </View>

          <View style={styles.dottedLine} />

          {/* Invoice Info */}
          <View style={styles.invoiceInfo}>
            <InfoRow label="Invoice #" value={invoice.invoiceNumber} />
            <InfoRow label="Date" value={invoice.date} />
            <InfoRow label="Time" value={invoice.time} />
            {invoice.customerName ? (
              <InfoRow label="Customer" value={invoice.customerName} />
            ) : null}
            {invoice.tableNumber ? (
              <InfoRow label="Ph No" value={invoice.tableNumber} />
            ) : null}
          </View>

          <View style={styles.dottedLine} />

          {/* Items Header */}
          <View style={styles.itemsHeader}>
            <AppText style={[styles.itemHeaderText, { flex: 2.5 }]}>Item</AppText>
            <AppText style={[styles.itemHeaderText, { width: 28, textAlign: 'center' }]}>Qty</AppText>
            <AppText style={[styles.itemHeaderText, { flex: 1, textAlign: 'right' }]}>Rate</AppText>
            <AppText style={[styles.itemHeaderText, { flex: 1.2, textAlign: 'right' }]}>Amt</AppText>
          </View>

          {/* Items */}
          {invoice.items.map((item, index) => (
            <ReceiptItem
              key={item.product.id}
              item={item}
              index={index}
              currency={info.currency}
            />
          ))}

          <View style={styles.dottedLine} />

          {/* Totals */}
          <View style={styles.totals}>
            <TotalRow label="Subtotal" value={formatCurrency(invoice.subtotal, info.currency)} />
            {invoice.discountAmount > 0 && (
              <TotalRow
                label={`Discount (${invoice.discount}%)`}
                value={`-${formatCurrency(invoice.discountAmount, info.currency)}`}
                valueStyle={{ color: Colors.success }}
              />
            )}
            <TotalRow
              label={`GST (${invoice.gst}%)`}
              value={formatCurrency(invoice.gstAmount, info.currency)}
              valueStyle={{ color: Colors.textSecondary }}
            />
          </View>

          <View style={styles.grandTotalRow}>
            <AppText style={styles.grandTotalLabel}>GRAND TOTAL</AppText>
            <AppText style={styles.grandTotalValue}>
              {formatCurrency(invoice.grandTotal, info.currency)}
            </AppText>
          </View>

          <View style={styles.dottedLine} />

          {/* Payment */}
          <View style={styles.paymentRow}>
            <Icon name="check-circle" size={18} color={Colors.success} />
            <AppText style={styles.paymentText}>
              Paid via {invoice.paymentMethod}
            </AppText>
          </View>

          <View style={styles.dottedLine} />

          {/* Footer */}
          <AppText style={styles.footer}>{info.receiptFooter}</AppText>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Actions */}
      <View style={[styles.actionBar, { paddingBottom: insets.bottom + Spacing.md }]}>
        <AppButton
          title="Share Receipt"
          onPress={handleShare}
          variant="outline"
          size="lg"
          style={styles.actionBtn}
          icon={<Icon name="share" size={18} color={Colors.primary} />}
        />
        <AppButton
          title="Back to Home"
          onPress={() => navigation.navigate('Main')}
          size="lg"
          style={styles.actionBtn}
          icon={<Icon name="home" size={18} color={Colors.textInverse} />}
        />
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={infoStyles.row}>
    <AppText style={infoStyles.label}>{label}</AppText>
    <AppText style={infoStyles.value}>{value}</AppText>
  </View>
);

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: { fontSize: Typography.fontSizeSM, color: Colors.textSecondary },
  value: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightSemiBold, color: Colors.text },
});

const TotalRow = ({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: object;
}) => (
  <View style={totalStyles.row}>
    <AppText style={totalStyles.label}>{label}</AppText>
    <AppText style={[totalStyles.value, valueStyle]}>{value}</AppText>
  </View>
);

const totalStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: { fontSize: Typography.fontSizeSM, color: Colors.textSecondary },
  value: { fontSize: Typography.fontSizeSM, fontWeight: Typography.fontWeightSemiBold },
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  successBanner: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  successSub: {
    fontSize: Typography.fontSizeMD,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  receipt: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  receiptHeader: {
    alignItems: 'center',
    paddingBottom: Spacing.md,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  restName: {
    fontSize: Typography.fontSizeLG,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginBottom: 2,
  },
  restAddress: {
    fontSize: Typography.fontSizeSM,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 2,
  },
  restContact: {
    fontSize: Typography.fontSizeXS,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    marginVertical: Spacing.md,
  },
  invoiceInfo: {
    paddingVertical: Spacing.xs,
  },
  itemsHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  itemHeaderText: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totals: {
    paddingVertical: Spacing.xs,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  grandTotalLabel: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightExtraBold,
    color: Colors.primary,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  paymentText: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightSemiBold,
    color: Colors.success,
  },
  footer: {
    textAlign: 'center',
    fontSize: Typography.fontSizeSM,
    color: Colors.primary,
    fontWeight: Typography.fontWeightMedium,
    paddingVertical: Spacing.sm,
    lineHeight: 20,
  },
  actionBar: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.md,
  },
  actionBtn: {
    flex: 1,
  },
  bottomSpacer: { height: Spacing.xxl },
});

export default ReceiptScreen;
