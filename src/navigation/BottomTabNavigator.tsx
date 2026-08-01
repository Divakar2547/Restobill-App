import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { BottomTabParamList } from '../types';

type TabIconName = React.ComponentProps<typeof Icon>['name'];
import { Colors, Typography, Shadow, Radius, Spacing } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import MenuScreen from '../screens/MenuScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAppSelector } from '../hooks/useRedux';

const Tab = createBottomTabNavigator<BottomTabParamList>();

interface TabConfig {
  name: keyof BottomTabParamList;
  icon: TabIconName;
  label: string;
}

const TABS: TabConfig[] = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Menu', icon: 'restaurant-menu', label: 'Menu' },
  { name: 'History', icon: 'history', label: 'History' },
  { name: 'Settings', icon: 'settings', label: 'Settings' },
];

const CustomTabBar = ({ state, navigation }: any) => {
  const cartCount = useAppSelector(s =>
    s.cart.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const handleTabPress = (tabName: keyof BottomTabParamList) => {
    navigation.navigate(tabName);
  };

  return (
    <View style={styles.tabBar}>
      {TABS.map((tab, index) => {
        const isFocused = state.index === index;
        const showBadge = tab.name === 'Menu' && cartCount > 0;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.name)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
              <Icon
                name={tab.icon}
                size={24}
                color={isFocused ? Colors.primary : Colors.textMuted}
              />
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.label,
                isFocused ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {tab.label}
            </Text>
            {isFocused && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#F7EAE1',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  label: {
    fontSize: Typography.fontSizeXS,
    fontWeight: Typography.fontWeightMedium,
    fontFamily: Typography.fontFamily,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeightSemiBold,
  },
  labelInactive: {
    color: Colors.textMuted,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 1,
  },
});

const BottomTabNavigator = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Menu" component={MenuScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
