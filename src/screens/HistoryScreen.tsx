import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Invoice } from '../types';
import { Colors, Spacing, Typography, Shadow } from '../theme';
import { useAppSelector } from '../hooks/useRedux';
import AppText from '../components/AppText';
import InvoiceCard from '../components/InvoiceCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const HistoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const invoices = useAppSelector(s => s.invoice.invoices);
  const { restaurantInfo } = useAppSelector(s => s.settings);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return invoices;
    const q = searchQuery.toLowerCase();
    return invoices.filter(
      inv =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.date.toLowerCase().includes(q) ||
        inv.paymentMethod.toLowerCase().includes(q) ||
        (inv.customerName ?? '').toLowerCase().includes(q),
    );
  }, [invoices, searchQuery]);

  const totalSales = useMemo(
    () => invoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
    [invoices],
  );

  const handlePress = useCallback(
    (invoice: Invoice) => navigation.navigate('Receipt', { invoiceId: invoice.id }),
    [navigation],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Invoice }) => (
      <InvoiceCard invoice={item} onPress={handlePress} />
    ),
    [handlePress],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2" style={styles.headerTitle}>Billing History</AppText>
        <AppText variant="caption">{invoices.length} invoices</AppText>
      </View>

      {/* Summary bar */}
      {invoices.length > 0 && (
        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <AppText style={styles.summaryValue}>{invoices.length}</AppText>
            <AppText style={styles.summaryLabel}>Total Orders</AppText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <AppText style={styles.summaryValue}>
              {formatCurrency(totalSales, restaurantInfo.currency)}
            </AppText>
            <AppText style={styles.summaryLabel}>Total Sales</AppText>
          </View>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by invoice, date, payment..."
        />
      </View>

      {/* List */}
      {filtered.length === 0 ? (
        invoices.length === 0 ? (
          <EmptyState
            icon="receipt-long"
            title="No invoices yet"
            subtitle="Your billing history will appear here after your first order"
          />
        ) : (
          <EmptyState
            icon="search-off"
            title="No results found"
            subtitle="Try searching with a different keyword"
            actionLabel="Clear Search"
            onAction={() => setSearchQuery('')}
          />
        )
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
    marginBottom: 2,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryValue: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textInverse,
  },
  summaryLabel: {
    fontSize: Typography.fontSizeXS,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: Typography.fontWeightMedium,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: Spacing.lg,
  },
  searchWrap: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
});

export default HistoryScreen;
