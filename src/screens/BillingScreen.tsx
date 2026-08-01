import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { RootStackParamList, Product } from '../types';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { setSelectedCategory, setSearchQuery } from '../store/slices/billingSlice';
import { addToCart } from '../store/slices/cartSlice';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import AppText from '../components/AppText';
import FoodCard from '../components/FoodCard';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { useCartCalculations } from '../hooks/useCartCalculations';
import { formatCurrency } from '../utils';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const BillingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const { selectedCategory, searchQuery } = useAppSelector(s => s.billing);
  const { restaurantInfo } = useAppSelector(s => s.settings);
  const { grandTotal, totalItems } = useCartCalculations();

  const filteredItems = useMemo(() => {
    let items = MENU_ITEMS;
    if (selectedCategory !== 'all') {
      items = items.filter(i => i.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q),
      );
    }
    return items;
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = useCallback(
    (product: Product) => dispatch(addToCart(product)),
    [dispatch],
  );

  const handleCategoryPress = useCallback(
    (id: string) => dispatch(setSelectedCategory(id)),
    [dispatch],
  );

  const renderFoodItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => {
      if (index % 2 !== 0) return null;
      const nextItem = filteredItems[index + 1];
      return (
        <View style={styles.row}>
          <View style={styles.col}>
            <FoodCard
              product={item}
              onAdd={handleAddToCart}
              currency={restaurantInfo.currency}
            />
          </View>
          <View style={styles.col}>
            {nextItem ? (
              <FoodCard
                product={nextItem}
                onAdd={handleAddToCart}
                currency={restaurantInfo.currency}
              />
            ) : (
              <View style={styles.col} />
            )}
          </View>
        </View>
      );
    },
    [filteredItems, handleAddToCart, restaurantInfo.currency],
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText variant="h3" style={styles.headerTitle}>Menu</AppText>
          <AppText variant="caption">{MENU_ITEMS.length} items</AppText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartBtn}
          activeOpacity={0.8}
        >
          <Icon name="shopping-cart" size={22} color={Colors.primary} />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <AppText style={styles.badgeText}>{totalItems}</AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={t => dispatch(setSearchQuery(t))}
          placeholder="Search dishes, categories..."
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        style={styles.categoriesScroll}
      >
        {CATEGORIES.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            isSelected={selectedCategory === cat.id}
            onPress={handleCategoryPress}
          />
        ))}
      </ScrollView>

      {/* Food Grid */}
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="search-off"
          title="No items found"
          subtitle="Try a different search or category"
          actionLabel="Clear Filters"
          onAction={() => {
            dispatch(setSearchQuery(''));
            dispatch(setSelectedCategory('all'));
          }}
        />
      ) : (
        <FlatList
          data={filteredItems.filter((_, i) => i % 2 === 0)}
          renderItem={({ item, index }) =>
            renderFoodItem({ item, index: index * 2 })
          }
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Cart Fab */}
      {totalItems > 0 && (
        <View style={[styles.cartFab, { bottom: insets.bottom + Spacing.xl }]}>
          <TouchableOpacity
            style={styles.cartFabBtn}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.9}
          >
            <View style={styles.cartFabLeft}>
              <View style={styles.cartFabBadge}>
                <AppText style={styles.cartFabBadgeText}>{totalItems}</AppText>
              </View>
              <AppText style={styles.cartFabLabel}>View Cart</AppText>
            </View>
            <AppText style={styles.cartFabTotal}>
              {formatCurrency(grandTotal, restaurantInfo.currency)}
            </AppText>
            <Icon name="arrow-forward-ios" size={14} color={Colors.textInverse} />
          </TouchableOpacity>
        </View>
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
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: Typography.fontWeightBold,
    color: Colors.textInverse,
  },
  searchWrap: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
  },
  categoriesScroll: {
    backgroundColor: Colors.surface,
    maxHeight: 60,
  },
  categoryList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    gap: 0,
  },
  col: {
    flex: 1,
  },
  cartFab: {
    position: 'absolute',
    left: Spacing.xl,
    right: Spacing.xl,
  },
  cartFabBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    ...Shadow.lg,
    gap: Spacing.md,
  },
  cartFabLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cartFabBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartFabBadgeText: {
    color: Colors.textInverse,
    fontSize: Typography.fontSizeSM,
    fontWeight: Typography.fontWeightBold,
  },
  cartFabLabel: {
    color: Colors.textInverse,
    fontWeight: Typography.fontWeightSemiBold,
    fontSize: Typography.fontSizeMD,
  },
  cartFabTotal: {
    color: Colors.textInverse,
    fontWeight: Typography.fontWeightBold,
    fontSize: Typography.fontSizeLG,
  },
});

export default BillingScreen;
