import React, { useCallback, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { RootStackParamList, Product } from '../types';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { MENU_ITEMS } from '../data/menuData';
import { formatCurrency, formatDate } from '../utils';
import AppText from '../components/AppText';
import DashboardCard from '../components/DashboardCard';
import FoodCard from '../components/FoodCard';
import { addToCart } from '../store/slices/cartSlice';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const { restaurantInfo } = useAppSelector(s => s.settings);
  const invoices = useAppSelector(s => s.invoice.invoices);
  const cartItems = useAppSelector(s => s.cart.items);

  const popularItems = useMemo(() => MENU_ITEMS.filter(m => m.isPopular), []);

  const todaySales = useMemo(() => {
    const today = formatDate(new Date());
    return invoices
      .filter(inv => inv.date === today)
      .reduce((sum, inv) => sum + inv.grandTotal, 0);
  }, [invoices]);

  const todayOrders = useMemo(() => {
    const today = formatDate(new Date());
    return invoices.filter(inv => inv.date === today).length;
  }, [invoices]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = useCallback(
    (product: Product) => dispatch(addToCart(product)),
    [dispatch],
  );

  const renderPopularItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.popularCardWrap}>
        <FoodCard
          product={item}
          onAdd={handleAddToCart}
          currency={restaurantInfo.currency}
        />
      </View>
    ),
    [handleAddToCart, restaurantInfo.currency],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.titleWrap}>
              <AppText variant="h2" style={styles.restaurantName} numberOfLines={1}>
                {restaurantInfo.name}
              </AppText>
              <AppText variant="caption" style={styles.dateText}>{formatDate(new Date())}</AppText>
            </View>
          </View>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.8}
          >
            <Icon name="shopping-cart" size={24} color={Colors.primary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <AppText style={styles.cartBadgeText}>{cartCount}</AppText>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Image
            source={require('../../assets/img1.png')}
            style={styles.bannerBackground}
            resizeMode="cover"
          />
          <View style={styles.bannerGlowOne} />
          <View style={styles.bannerGlowTwo} />
          <View style={styles.bannerContent}>
            <AppText style={styles.bannerTag}>TODAY'S SPECIAL</AppText>
            <AppText style={styles.bannerTitle}>Fresh & Delicious{'\n'}Food Awaits</AppText>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => navigation.navigate('Billing')}
              activeOpacity={0.8}
            >
              <AppText style={styles.bannerBtnText}>Order Now</AppText>
              <Icon name="arrow-forward" size={16} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <DashboardCard
            label="Today's Sales"
            value={formatCurrency(todaySales, restaurantInfo.currency)}
            icon="attach-money"
            iconColor={Colors.success}
            iconBg={Colors.successLight}
            style={styles.statCard}
          />
          <DashboardCard
            label="Today's Orders"
            value={String(todayOrders)}
            icon="receipt-long"
            iconColor={Colors.primary}
            iconBg={Colors.background}
            style={styles.statCard}
          />
        </View>

        <View style={styles.statsRow}>
          <DashboardCard
            label="Total Invoices"
            value={String(invoices.length)}
            icon="inventory"
            iconColor={Colors.info}
            iconBg="#E3F2FD"
            style={styles.statCard}
          />
          <DashboardCard
            label="Menu Items"
            value={String(MENU_ITEMS.length)}
            icon="restaurant-menu"
            iconColor={Colors.warning}
            iconBg={Colors.warningLight}
            style={styles.statCard}
          />
        </View>

        <View style={styles.darkSection}>
          {/* Popular Items */}
          <View style={styles.sectionHeader}>
            <AppText variant="h3" style={styles.sectionTitle}>Popular Items</AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Billing')} activeOpacity={0.7}>
              <AppText style={styles.seeAll}>See All</AppText>
            </TouchableOpacity>
          </View>

          <FlatList
            data={popularItems}
            renderItem={renderPopularItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularList}
            scrollEnabled
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  darkSection: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    ...Shadow.sm,
  },
  logoImage: {
    width: 34,
    height: 34,
  },
  titleWrap: {
    flex: 1,
  },
  restaurantName: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginBottom: 2,
  },
  dateText: {
    color: Colors.textSecondary,
  },
  cartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
    marginLeft: Spacing.md,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textInverse,
  },
  banner: {
    position: 'relative',
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    marginBottom: Spacing.xl,
    height: 180,
    overflow: 'hidden',
    ...Shadow.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
  },
  bannerBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.9,
    resizeMode: 'cover',
  },
  bannerGlowOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -60,
    right: -30,
  },
  bannerGlowTwo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.08)',
    bottom: -30,
    left: -10,
  },
  bannerContent: {
    flex: 1,
    zIndex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  bannerTag: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightBold,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily,
  },
  bannerTitle: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textInverse,
    marginBottom: Spacing.lg,
    lineHeight: 28,
    fontFamily: Typography.fontFamily,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  bannerBtnText: {
    color: Colors.textInverse,
    fontWeight: Typography.fontWeightSemiBold,
    fontSize: Typography.fontSizeSM,
    fontFamily: Typography.fontFamily,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: Typography.fontSizeXL,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: Typography.fontSizeSM,
    color: Colors.primary,
    fontWeight: Typography.fontWeightSemiBold,
  },
  popularList: {
    paddingRight: Spacing.lg,
  },
  popularCardWrap: {
    width: 160,
    marginRight: Spacing.md,
  },
  bottomSpacer: {
    height: Spacing.xxxl,
  },
});

export default HomeScreen;
