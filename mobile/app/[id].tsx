import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert, GestureResponderEvent } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// Local fallback PrimaryButton to avoid unresolved import during development.

type DishWithExtras = {
  id: number;
  nom: string;
  prix: number;
  categorie: string;
  disponible: boolean;
  description: string;
  prepTime: string;
  image: string | null;
};

type PrimaryButtonProps = {
  label: string;
  variant?: 'default' | 'outline' | 'danger';
  onPress?: (e: GestureResponderEvent) => void;
};

function PrimaryButton({ label, variant = 'default', onPress }: PrimaryButtonProps) {
  const btnStyles = [
    styles.primaryButton,
    variant === 'outline' && styles.primaryButtonOutline,
    variant === 'danger' && styles.primaryButtonDanger,
  ];
  const textStyle = [styles.primaryButtonLabel, variant === 'outline' && styles.primaryButtonLabelOutline];

  return (
    <Pressable style={btnStyles as any} onPress={onPress}>
      <Text style={textStyle as any}>{label}</Text>
    </Pressable>
  );
}

// TODO: replace with useQuery(["plats", id], () => getPlatById(id)).
// `description` and `prepTime` are NOT in your backend model — local-only
// until you decide to extend the `plats` table.
const MOCK_DISH: DishWithExtras = {
  id: 1,
  nom: 'Tacos Poulet',
  prix: 45,
  categorie: 'Main Course',
  disponible: true,
  description:
    'Classic French-style taco loaded with tender grilled chicken breast, our signature secret sauce, crispy fries, and a rich blend of melted gruyère and cheddar cheese, all wrapped in a freshly pressed flour tortilla.',
  prepTime: '10-15 mins',
  image: null,
};

const colors = {
  background: '#ffffff',
  surface: '#f3f4f6',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  accent: '#ef4444',
};

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const dish = MOCK_DISH; // TODO: look up the real dish by `id`

  function confirmDelete() {
    Alert.alert('Delete this dish?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          // TODO: useMutation calling DELETE /api/plats/:id,
          // then invalidateQueries(["plats"]) and navigate back.
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={styles.header}>
        <Pressable style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={styles.backLabel}>Home</Text>
        </Pressable>
      </View>

      <View style={styles.imageWrapper}>
        {dish.image ? (
          <Image source={{ uri: dish.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Ionicons name="fast-food-outline" size={40} color={colors.textMuted} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{dish.nom}</Text>
        <Text style={styles.price}>{dish.prix} MAD</Text>

        <Text style={styles.sectionLabel}>DESCRIPTION</Text>
        <Text style={styles.description}>{dish.description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{dish.categorie}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Prep Time</Text>
            <Text style={styles.infoValue}>{dish.prepTime}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label="EDIT DISH"
              variant="outline"
              onPress={() => router.push(`/modal?id=${dish.id}`)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton label="DELETE DISH" variant="danger" onPress={confirmDelete} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 16 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backLabel: { color: colors.textPrimary, fontWeight: '600' },
  imageWrapper: { paddingHorizontal: 16 },
  image: { width: '100%', height: 220, borderRadius: 20 },
  imagePlaceholder: { backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 20, gap: 6 },
  name: { color: colors.textPrimary, fontSize: 22, fontWeight: '700' },
  price: { color: colors.accent, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  sectionLabel: { color: colors.textSecondary, fontSize: 12, letterSpacing: 1, marginTop: 8 },
  description: { color: colors.textSecondary, fontSize: 14, lineHeight: 21, marginTop: 6 },
  infoRow: { flexDirection: 'row', gap: 16, marginTop: 20 },
  infoCol: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  infoLabel: { color: colors.textMuted, fontSize: 11, marginBottom: 4 },
  infoValue: { color: colors.textPrimary, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 28 },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  primaryButtonDanger: {
    backgroundColor: colors.accent,
  },
  primaryButtonLabel: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  primaryButtonLabelOutline: {
    color: colors.accent,
  },
});