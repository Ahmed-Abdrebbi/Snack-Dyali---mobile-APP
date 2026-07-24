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

  const loadLastSync = async () => {
    const syncTime = await AsyncStorage.getItem('last_sync');
    if (syncTime) {
      setLastSync(new Date(syncTime));
    }
  };

  useEffect(() => {
    loadLastSync();
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
    if (!date) return 'Jamais';
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "À l'instant";
    return `il y a ${mins} min`;
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: '/[id]', params: { id: item.id } })}
    >
      <StitchCard style={styles.dishCard}>
        <View style={styles.cardContent}>
          {/* Left: dish info */}
          <View style={styles.cardInfo}>
            <Text style={styles.dishName}>{item.nom}</Text>
            <Text style={styles.dishCategory}>{item.categorie}</Text>
            <Text style={styles.dishPrice}>{item.prix} MAD</Text>
          </View>

          {/* Right: toggle */}
          <View style={styles.cardToggle}>
            <StitchToggle
              value={item.disponible}
              onValueChange={() => toggleMutation.mutate(item)}
            />
            <Text
              style={[
                styles.toggleLabel,
                {
                  color: item.disponible
                    ? Colors.dark.primary
                    : Colors.dark.textMuted,
                },
              ]}
            >
              {item.disponible ? 'Dispo' : 'Indispo'}
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
          <Text style={styles.logoText}>Snack</Text>
          <Text style={styles.logoAccent}> Dyali</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Ionicons
            name="person-circle-outline"
            size={32}
            color={Colors.dark.text}
          />
        </TouchableOpacity>
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

      {/* ─── SYNC STATUS BANNER ─── */}
      <View style={styles.syncBanner}>
        <View style={styles.syncLeft}>
          <Ionicons
            name="time-outline"
            size={14}
            color={Colors.dark.textMuted}
          />
          <Text style={styles.syncText}>
            Dernière synchro : {getTimeAgo(lastSync)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={forceSync}
          activeOpacity={0.7}
        >
          <Ionicons
            name="sync-outline"
            size={18}
            color={Colors.dark.primary}
          />
        </TouchableOpacity>
      </View>

      {/* ─── DISH LIST ─── */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={plats}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
              tintColor={Colors.dark.primary}
              colors={[Colors.dark.primary]}
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
              <Text style={styles.emptyText}>Aucun plat pour le moment</Text>
              <Text style={styles.emptySubtext}>
                Appuyez sur + pour ajouter un plat
              </Text>
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
        <Ionicons name="add" size={28} color={Colors.dark.primaryText} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    ...Typography.headlineMd,
    color: Colors.dark.text,
  },
  logoAccent: {
    ...Typography.headlineMd,
    color: Colors.dark.primary,
  },
  profileBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Offline Banner ──
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

  // ── Sync Banner ──
  syncBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundElevated,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.xs,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  syncText: {
    ...Typography.bodySm,
    color: Colors.dark.textMuted,
  },
  syncBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── List ──
  list: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.md,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Dish Card ──
  dishCard: {
    marginBottom: Spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  dishName: {
    ...Typography.bodyLgBold,
    color: Colors.dark.text,
    marginBottom: 2,
  },
  dishCategory: {
    ...Typography.labelMd,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  dishPrice: {
    ...Typography.bodyLgBold,
    color: Colors.dark.primary,
  },
  cardToggle: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  toggleLabel: {
    ...Typography.labelSm,
    textTransform: 'uppercase',
  },

  // ── Empty State ──
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
  emptySubtext: {
    ...Typography.bodySm,
    color: Colors.dark.textDisabled,
  },

  // ── FAB ──
  fab: {
    position: 'absolute',
    right: Spacing.screenPadding,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
      },
      default: {
        shadowColor: Colors.dark.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
    }),
  } as any,
});
