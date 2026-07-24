import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getPlatById, createPlat, updatePlat } from '../src/api/plats';
import { Colors, Typography, Spacing, Rounded } from '@/constants/theme';
import {
  StitchHeader,
  StitchInput,
  StitchButton,
  StitchToggle,
} from '@/components/StitchComponents';

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const isEditing = !!params.id;

  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [categorie, setCategorie] = useState('');
  const [disponible, setDisponible] = useState(true);

  const { data: plat, isLoading: isLoadingPlat } = useQuery({
    queryKey: ['plat', params.id],
    queryFn: () => getPlatById(params.id as string),
    enabled: isEditing,
  });

  useEffect(() => {
    if (plat) {
      setNom(plat.nom);
      setPrix(plat.prix.toString());
      setCategorie(plat.categorie);
      setDisponible(plat.disponible);
    }
  }, [plat]);

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditing
        ? updatePlat({ id: params.id as string, ...data })
        : createPlat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plats'] });
      router.back();
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue');
    },
  });

  const handleSubmit = () => {
    if (!nom.trim() || !prix.trim() || !categorie.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    mutation.mutate({
      nom,
      prix: parseFloat(prix),
      categorie,
      disponible,
    });
  };

  if (isEditing && isLoadingPlat) {
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
        title={isEditing ? 'Modifier le plat' : 'Ajouter un plat'}
        leftIcon="close"
        onLeftPress={() => router.back()}
      />

      {/* ─── FORM ─── */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <StitchInput
            label="Nom du plat"
            value={nom}
            onChangeText={setNom}
            placeholder="Ex: Tacos Poulet"
          />

          <StitchInput
            label="Prix"
            value={prix}
            onChangeText={setPrix}
            placeholder="Ex: 35"
            keyboardType="numeric"
            suffix="MAD"
          />

          <StitchInput
            label="Catégorie"
            value={categorie}
            onChangeText={setCategorie}
            placeholder="Ex: Fast Food"
          />

          {/* ─── TOGGLE FIELD ─── */}
          <View style={styles.toggleField}>
            <Text
              style={[
                Typography.labelMd,
                { color: Colors.dark.textMuted, marginBottom: Spacing.sm },
              ]}
            >
              DISPONIBILITÉ
            </Text>
            <View style={styles.toggleContainer}>
              <StitchToggle
                value={disponible}
                onValueChange={setDisponible}
                label={disponible ? 'Disponible' : 'Indisponible'}
              />
            </View>
          </View>
        </ScrollView>

        {/* ─── CTA ─── */}
        <View style={styles.ctaContainer}>
          <StitchButton
            title={
              mutation.isPending
                ? 'Enregistrement...'
                : 'Enregistrer'
            }
            onPress={handleSubmit}
            disabled={mutation.isPending}
            style={styles.ctaButton}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Form ──
  formContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // ── Toggle Field ──
  toggleField: {
    marginBottom: Spacing.lg,
  },
  toggleContainer: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceBorder,
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },

  // ── CTA ──
  ctaContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 36,
    paddingTop: Spacing.md,
    backgroundColor: Colors.dark.background,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.surfaceBorder,
  },
  ctaButton: {
    borderRadius: Rounded.md,
  },
});
