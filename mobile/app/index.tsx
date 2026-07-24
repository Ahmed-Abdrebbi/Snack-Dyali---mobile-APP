import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getPlats, updatePlat, deletePlat } from '../src/api/plats';
import { Colors, Typography, Spacing, Rounded } from '@/constants/theme';
import { StitchCard, StitchToggle } from '@/components/StitchComponents';

export default function MenuDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const loadLastSync = async () => {
    const syncTime = await AsyncStorage.getItem('last_sync');
    if (syncTime) {
      setLastSync(new Date(syncTime));
    }
  };

  const checkIntroAndSync = async () => {
    const hasSeenIntro = await AsyncStorage.getItem('has_seen_intro');
    if (!hasSeenIntro) {
      router.replace('/intro');
      return;
    }
    await loadLastSync();
  };

  useEffect(() => {
    checkIntroAndSync();
  }, []);

  const {
    data: plats,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['plats'],
    queryFn: async () => {
      try {
        const data = await getPlats();
        setIsOffline(false);
        await loadLastSync();
        return data;
      } catch (error) {
        setIsOffline(true);
        throw error;
      }
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (plat: any) =>
      updatePlat({ ...plat, disponible: !plat.disponible }),
    onMutate: async (updatedPlat: any) => {
      await queryClient.cancelQueries({ queryKey: ['plats'] });
      const previousPlats = queryClient.getQueryData(['plats']);
      queryClient.setQueryData(['plats'], (old: any) =>
        old?.map((p: any) =>
          p.id === updatedPlat.id
            ? { ...p, disponible: !p.disponible }
            : p
        )
      );
      return { previousPlats };
    },
    onError: (_err: any, _newTodo: any, context: any) => {
      queryClient.setQueryData(['plats'], context.previousPlats);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] });
    },
  });

  const onRefresh = useCallback(async () => {
    await refetch();
    await loadLastSync();
  }, [refetch]);

  const forceSync = async () => {
    await refetch();
    await loadLastSync();
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return 'Never';
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "Just now";
    return `${mins} min ago`;
  };

  const categories = ['All', 'Tacos', 'Burgers', 'Drinks'];
  const filteredPlats = selectedCategory === 'All' 
    ? plats 
    : plats?.filter((p: any) => p.categorie.toLowerCase() === selectedCategory.toLowerCase());

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/[id]', params: { id: item.id } })}
    >
      <StitchCard style={styles.dishCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.dishName}>{item.nom}</Text>
          <Text style={styles.dishPrice}>{item.prix} MAD</Text>
        </View>
        <Text style={styles.dishCategory}>{item.categorie}</Text>
        
        <View style={styles.cardFooterRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.toggleContainer}>
            <StitchToggle
              value={item.disponible}
              onValueChange={() => toggleMutation.mutate(item)}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.disponible ? '#4caf50' : '#8e8e8e' },
              ]}
            >
              {item.disponible ? 'Available' : 'Unavailable'}
            </Text>
          </View>
        </View>
      </StitchCard>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top || (Platform.OS === 'web' ? 16 : 48) }]}>
      {/* ─── CUSTOM HEADER ─── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoX}>X</Text>
          <View style={styles.logoBox}>
             <Ionicons name="triangle" size={10} color="#a78b7c" />
          </View>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
           <Image source={{uri: 'https://i.pravatar.cc/100'}} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {/* ─── SYNC STATUS BANNER ─── */}
      <View style={styles.syncBanner}>
        <Text style={styles.syncText}>
          Last sync {getTimeAgo(lastSync)}
        </Text>
        <TouchableOpacity
          style={styles.syncRight}
          onPress={forceSync}
          activeOpacity={0.7}
        >
          <Ionicons
            name="sync-outline"
            size={14}
            color="#a78b7c"
          />
          <Text style={styles.syncBtnText}>Force Sync</Text>
        </TouchableOpacity>
      </View>

      {/* ─── CATEGORIES ─── */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setSelectedCategory(cat)} 
              style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ─── OFFLINE BANNER ─── */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Ionicons
            name="cloud-offline-outline"
            size={16}
            color={Colors.dark.secondary}
          />
          <Text style={styles.offlineText}>
            Mode hors-ligne · Réseau indisponible
          </Text>
        </View>
      )}

      {/* ─── DISH LIST ─── */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff7a00" />
        </View>
      ) : (
        <FlatList
          data={filteredPlats}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor="#ff7a00"
              colors={['#ff7a00']}
              progressBackgroundColor={Colors.dark.surface}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="restaurant-outline"
                size={48}
                color={Colors.dark.textMuted}
              />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          }
        />
      )}

      {/* ─── FAB ─── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/modal')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#121414" />
      </TouchableOpacity>

      {/* ─── BOTTOM NAV ─── */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="receipt-outline" size={24} color="#8e8e8e" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeNavIconBg}>
            <Ionicons name="restaurant-outline" size={20} color="#121414" />
          </View>
          <Text style={[styles.navText, styles.navTextActive]}>Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#8e8e8e" />
          <Text style={styles.navText}>Kitchen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color="#8e8e8e" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoX: {
    color: '#ff7a00',
    fontSize: 20,
    fontWeight: '900',
  },
  logoBox: {
    backgroundColor: '#343535',
    padding: 4,
    borderRadius: 4,
    marginLeft: 6,
  },
  profileBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  syncBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  syncText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#a78b7c', // outline color
  },
  syncRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncBtnText: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#a78b7c',
  },
  categoriesContainer: {
    marginBottom: Spacing.sm,
  },
  categoriesScroll: {
    paddingHorizontal: Spacing.screenPadding,
    gap: 12,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#343535',
    backgroundColor: 'transparent',
  },
  categoryPillActive: {
    backgroundColor: '#ff7a00',
    borderColor: '#ff7a00',
  },
  categoryText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#e3e2e2',
  },
  categoryTextActive: {
    color: '#121414', // dark text on orange
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginHorizontal: Spacing.screenPadding,
    borderRadius: Rounded.DEFAULT,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  offlineText: {
    ...Typography.bodySm,
    color: Colors.dark.secondary,
  },
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 100, // padding for fab and bottom nav
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dishCard: {
    backgroundColor: '#1a1c1c', // slightly lighter than bg
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: Rounded.md,
    borderWidth: 1,
    borderColor: '#292a2a',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#e3e2e2',
  },
  dishPrice: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#ffb68b',
  },
  dishCategory: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: '#a78b7c',
    textTransform: 'uppercase',
    marginTop: 4,
    marginBottom: 16,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#292a2a',
    paddingTop: 12,
  },
  statusLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#a78b7c',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: Spacing.sm,
  },
  emptyText: {
    ...Typography.bodyLg,
    color: Colors.dark.textMuted,
    marginTop: Spacing.md,
  },
  fab: {
    position: 'absolute',
    right: Spacing.screenPadding,
    bottom: 90, // above bottom nav
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff7a00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#ff7a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121414',
    borderTopWidth: 1,
    borderTopColor: '#292a2a',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeNavIconBg: {
    backgroundColor: '#ff7a00',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  navText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#8e8e8e',
  },
  navTextActive: {
    color: '#ff7a00',
    fontWeight: '600',
  },
});
