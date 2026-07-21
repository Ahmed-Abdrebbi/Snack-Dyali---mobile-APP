import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Rounded } from '@/constants/theme';
import { StitchCard, StitchBadge } from '@/components/StitchComponents';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

type Dish = {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
};

const INITIAL_DISHES: Dish[] = [
  { id: '1', name: 'Tajine Poulet', price: 65, category: 'Main', available: true },
  { id: '2', name: 'Couscous Royal', price: 85, category: 'Main', available: true },
  { id: '3', name: 'Zaalouk', price: 20, category: 'Starter', available: false },
  { id: '4', name: 'Mint Tea', price: 15, category: 'Drink', available: true },
];

const CATEGORIES = ['All', 'Starter', 'Main', 'Drink'];

export default function MenuDashboardScreen() {
  const router = useRouter();
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'offline' | 'online'>('online');

  const toggleAvailability = (id: string) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d))
    );
  };

  const handleForceSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('online'), 1500);
  };

  const filteredDishes = dishes.filter(
    (d) => activeCategory === 'All' || d.category === activeCategory
  );

  const renderDish = ({ item }: { item: Dish }) => (
    <StitchCard style={styles.dishCard}>
      <View style={styles.dishHeader}>
        <View style={styles.dishInfo}>
          <Text style={[Typography.headlineSm, { color: Colors.dark.text }]}>{item.name}</Text>
          <Text style={[Typography.bodyMd, { color: Colors.dark.textDim, marginTop: Spacing.xs }]}>
            {item.price.toFixed(2)} MAD
          </Text>
        </View>
        <StitchBadge title={item.category} status="warning" />
      </View>
      <View style={styles.dishFooter}>
        <Text style={[Typography.labelMd, { color: item.available ? Colors.dark.success : Colors.dark.secondary }]}>
          {item.available ? 'AVAILABLE' : 'OUT OF STOCK'}
        </Text>
        <Switch
          value={item.available}
          onValueChange={() => toggleAvailability(item.id)}
          trackColor={{ false: Colors.dark.surfaceRaised, true: Colors.dark.primary }}
          thumbColor={Colors.dark.text}
        />
      </View>
    </StitchCard>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="restaurant" size={24} color={Colors.dark.primary} />
          <Text style={[Typography.headlineMd, { color: Colors.dark.text, marginLeft: Spacing.sm }]}>SNACK DYALI</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons name="person-circle" size={32} color={Colors.dark.textDim} />
        </TouchableOpacity>
      </View>

      {/* Sync Status Banner */}
      <View style={[styles.syncBanner, syncStatus === 'offline' && { backgroundColor: 'rgba(229, 57, 53, 0.1)' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons
            name={syncStatus === 'offline' ? 'cloud-offline' : syncStatus === 'syncing' ? 'sync' : 'checkmark-circle'}
            size={16}
            color={syncStatus === 'offline' ? Colors.dark.secondary : Colors.dark.success}
          />
          <Text style={[Typography.labelMd, { color: Colors.dark.textDim, marginLeft: Spacing.xs }]}>
            {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'offline' ? 'Offline' : 'Last sync: 2 min ago'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleForceSync} disabled={syncStatus === 'syncing'}>
          <Text style={[Typography.labelMd, { color: Colors.dark.primary }]}>FORCE SYNC</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                activeCategory === item && styles.categoryPillActive
              ]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[
                Typography.labelMd,
                { color: activeCategory === item ? '#000' : Colors.dark.textDim }
              ]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: Spacing.md }}
        />
      </View>

      {/* Dish List */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/modal')}
      >
        <Ionicons name="add" size={28} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBtn: {
    padding: Spacing.xs,
  },
  syncBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  categoryContainer: {
    paddingVertical: Spacing.md,
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Rounded.full,
    backgroundColor: Colors.dark.surfaceRaised,
    marginRight: Spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: Colors.dark.primary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 100, // For FAB
  },
  dishCard: {
    padding: 0,
    overflow: 'hidden',
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  dishInfo: {
    flex: 1,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.dark.surfaceRaised,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
