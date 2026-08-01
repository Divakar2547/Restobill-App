import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { RootStackParamList, Product } from '../types';
import { Colors, Spacing, Typography, Shadow } from '../theme';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { setSelectedCategory, setSearchQuery } from '../store/slices/billingSlice';
import { addToCart } from '../store/slices/cartSlice';
import { MENU_ITEMS, CATEGORIES } from '../data/menuData';
import AppText from '../components/AppText';
import FoodCard from '../components/FoodCard';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const MenuScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();

  const { selectedCategory, searchQuery } = useAppSelector(s => s.billing);
  const { restaurantInfo } = useAppSelector(s => s.settings);
  const cartCount = useAppSelector(s =>
    s.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

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

      <View style={styles.header}>
        <View style={styles.headerTextWrap}>
          <AppText variant="h2" style={styles.headerTitle}>Menu</AppText>
          <AppText variant="caption">{MENU_ITEMS.length} delicious items</AppText>
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.8}
        >
          <Icon name="shopping-cart" size={22} color={Colors.primary} />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <AppText style={styles.cartBadgeText}>{cartCount}</AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={t => dispatch(setSearchQuery(t))}
          placeholder="Search dishes, categories..."
        />
      </View>

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
          renderItem={({ item, index }) => renderFoodItem({ item, index: index * 2 })}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    ...Shadow.sm,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize2XL,
    fontWeight: Typography.fontWeightBold,
    marginBottom: 2,
  },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: Typography.fontWeightBold,
    fontFamily: Typography.fontFamily,
  },
  searchWrap: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  categoriesScroll: {
    backgroundColor: Colors.surface,
    maxHeight: 72,
    marginBottom: Spacing.xs,
  },
  categoryList: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 80,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
});

export default MenuScreen;
