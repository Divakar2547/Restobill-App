import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Switch,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { updateRestaurantInfo, setDarkMode } from '../store/slices/settingsSlice';
import { clearInvoices } from '../store/slices/invoiceSlice';
import { StorageService } from '../services/StorageService';
import { RestaurantInfo } from '../types';
import AppText from '../components/AppText';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(s => s.settings);
  const { restaurantInfo, darkMode } = settings;

  const [form, setForm] = useState<RestaurantInfo>({ ...restaurantInfo });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateField = useCallback(
    <K extends keyof RestaurantInfo>(key: K, value: RestaurantInfo[K]) => {
      setForm(prev => ({ ...prev, [key]: value }));
      setHasChanges(true);
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      Alert.alert('Validation', 'Restaurant name is required');
      return;
    }
    setSaving(true);
    dispatch(updateRestaurantInfo(form));
    const updated = { ...settings, restaurantInfo: form };
    await StorageService.saveSettings(updated);
    setSaving(false);
    setHasChanges(false);
    Alert.alert('Saved', 'Settings saved successfully!');
  }, [dispatch, form, settings]);

  const handleToggleDarkMode = useCallback(
    async (nextValue: boolean) => {
      dispatch(setDarkMode(nextValue));
      const updated = { ...settings, darkMode: nextValue };
      await StorageService.saveSettings(updated);
    },
    [dispatch, settings],
  );

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      'Clear History',
      'This will permanently delete all invoice history. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearInvoices());
            await StorageService.saveInvoices([]);
            Alert.alert('Done', 'Invoice history cleared');
          },
        },
      ],
    );
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <AppText variant="h2" style={styles.headerTitle}>Settings</AppText>
        <AppText variant="caption">Manage your restaurant profile</AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Restaurant Info */}
        <SectionHeader icon="store" title="Restaurant Information" />
        <View style={styles.card}>
          <AppInput
            label="Restaurant Name"
            value={form.name}
            onChangeText={t => updateField('name', t)}
            placeholder="Your restaurant name"
            leftIcon={<Icon name="restaurant" size={18} color={Colors.textMuted} />}
          />
          <AppInput
            label="Address"
            value={form.address}
            onChangeText={t => updateField('address', t)}
            placeholder="Full address"
            multiline
            leftIcon={<Icon name="location-on" size={18} color={Colors.textMuted} />}
          />
          <AppInput
            label="Phone Number"
            value={form.phone}
            onChangeText={t => updateField('phone', t)}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
            leftIcon={<Icon name="phone" size={18} color={Colors.textMuted} />}
          />
          <AppInput
            label="GST Number"
            value={form.gstNumber}
            onChangeText={t => updateField('gstNumber', t.toUpperCase())}
            placeholder="29ABCDE1234F1Z5"
            autoCapitalize="characters"
            leftIcon={<Icon name="confirmation-number" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* Billing Settings */}
        <SectionHeader icon="receipt" title="Billing Settings" />
        <View style={styles.card}>
          <AppInput
            label="Currency Symbol"
            value={form.currency}
            onChangeText={t => updateField('currency', t)}
            placeholder="₹"
            leftIcon={<Icon name="currency-rupee" size={18} color={Colors.textMuted} />}
          />
          <AppInput
            label="GST Percentage (%)"
            value={String(form.gstPercentage)}
            onChangeText={t => {
              const val = parseFloat(t);
              updateField('gstPercentage', isNaN(val) ? 0 : Math.min(100, val));
            }}
            placeholder="5"
            keyboardType="numeric"
            leftIcon={<Icon name="percent" size={18} color={Colors.textMuted} />}
          />
          <AppInput
            label="Receipt Footer Message"
            value={form.receiptFooter}
            onChangeText={t => updateField('receiptFooter', t)}
            placeholder="Thank you for dining with us!"
            leftIcon={<Icon name="message" size={18} color={Colors.textMuted} />}
          />
        </View>

        {/* App Settings */}
        <SectionHeader icon="tune" title="App Settings" />
        <View style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Icon name="dark-mode" size={22} color={Colors.text} />
              <View style={styles.toggleText}>
                <AppText style={styles.toggleLabel}>Dark Mode</AppText>
                <AppText variant="caption">Toggle dark appearance</AppText>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={value => handleToggleDarkMode(value)}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.surface}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <SectionHeader icon="warning" title="Data Management" />
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleClearHistory}
            activeOpacity={0.8}
          >
            <View style={styles.dangerLeft}>
              <Icon name="delete-sweep" size={22} color={Colors.error} />
              <View style={styles.dangerText}>
                <AppText style={[styles.toggleLabel, { color: Colors.error }]}>
                  Clear Invoice History
                </AppText>
                <AppText variant="caption">Permanently delete all invoices</AppText>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        {hasChanges && (
          <AppButton
            title="Save Changes"
            onPress={handleSave}
            loading={saving}
            size="lg"
            style={styles.saveBtn}
            icon={<Icon name="save" size={20} color={Colors.textInverse} />}
          />
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SectionHeader = ({ icon, title }: { icon: React.ComponentProps<typeof Icon>['name']; title: string }) => (
  <View style={sectionStyles.container}>
    <Icon name={icon} size={18} color={Colors.primary} />
    <AppText style={sectionStyles.title}>{title}</AppText>
  </View>
);

const sectionStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  title: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightBold,
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

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
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadow.sm,
    gap: 0,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  toggleText: { flex: 1, gap: 2 },
  toggleLabel: {
    fontSize: Typography.fontSizeMD,
    fontWeight: Typography.fontWeightMedium,
    color: Colors.text,
  },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  dangerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  dangerText: { flex: 1, gap: 2 },
  saveBtn: {
    marginTop: Spacing.xl,
    width: '100%',
  },
  bottomSpacer: { height: Spacing.xxxl },
});

export default SettingsScreen;
