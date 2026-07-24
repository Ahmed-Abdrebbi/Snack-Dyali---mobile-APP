import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPlatById, deletePlat } from '../src/api/plats';
import { Colors, Typography, Spacing, Rounded } from '@/constants/theme';
import {
  StitchHeader,
  StitchButton,
  StitchBadge,
} from '@/components/StitchComponents';

export default function DishDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const id = params.id as string;

  const { data: plat, isLoading } = useQuery({
    queryKey: ['plat', id],
    queryFn: () => getPlatById(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deletePlat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || 'Impossible de supprimer ce plat');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le plat',
      `Êtes-vous sûr de vouloir supprimer "${plat?.nom}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading || !plat) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || (Platform.OS === 'web' ? 16 : 48) }]}>
      {/* ─── HEADER ─── */}
      <StitchHeader
        leftIcon="chevron-back"
        onLeftPress={() => router.back()}
      />

      {/* ─── CONTENT ─── */}
      <View style={styles.content}>
        {/* Badge */}
        <StitchBadge
          title={plat.disponible ? 'Disponible' : 'Indisponible'}
          status={plat.disponible ? 'success' : 'error'}
        />

        {/* Name */}
        <Text style={styles.dishName}>{plat.nom}</Text>

        {/* Category */}
        <Text style={styles.dishCategory}>{plat.categorie}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Price */}
        <Text style={styles.priceLabel}>PRIX</Text>
        <Text style={styles.dishPrice}>{plat.prix} MAD</Text>
      </View>

      {/* ─── ACTIONS ─── */}
      <View style={styles.actions}>
        <StitchButton
          title="Modifier"
          variant="outline"
          onPress={() =>
            router.push({
              pathname: '/modal',
              params: { id: plat.id },
            })
          }
          style={styles.actionBtn}
        />
        <StitchButton
          title={deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
          variant="destructive"
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
          style={styles.actionBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Content ──
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  dishName: {
    ...Typography.headlineLg,
    color: Colors.dark.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  dishCategory: {
    ...Typography.bodyMd,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.surfaceBorder,
    marginVertical: Spacing.lg,
  },
  priceLabel: {
    ...Typography.labelMd,
    color: Colors.dark.textMuted,
    marginBottom: Spacing.xs,
  },
  dishPrice: {
    ...Typography.headlineMd,
    color: Colors.dark.primary,
  },

  // ── Actions ──
  actions: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 36,
    paddingTop: Spacing.md,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.surfaceBorder,
    backgroundColor: Colors.dark.background,
  },
  actionBtn: {
    borderRadius: Rounded.md,
  },
});
