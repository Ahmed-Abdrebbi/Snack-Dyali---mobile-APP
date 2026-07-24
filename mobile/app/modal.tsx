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
  TouchableOpacity,
  TextInput,
  Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPlatById, createPlat, updatePlat } from '../src/api/plats';
import { Colors, Spacing } from '@/constants/theme';

export default function ModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const isEditing = !!params.id;

  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [categorie, setCategorie] = useState('Main Course');
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
      Alert.alert('Error', error.message || 'An error occurred');
    },
  });

  const handleSubmit = () => {
    if (!nom.trim() || !prix.trim() || !categorie.trim()) {
      Alert.alert('Error', 'Please fill all fields');
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
        <ActivityIndicator size="large" color="#ff7a00" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top || (Platform.OS === 'web' ? 16 : 48) }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#ff7a00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Dish' : 'Add New Dish'}</Text>
        <View style={{ width: 24 }} /> {/* placeholder for balance */}
      </View>

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
          <View style={styles.card}>
            {/* Dish Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dish Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={nom}
                  onChangeText={setNom}
                  placeholder="e.g., Tacos Poulet"
                  placeholderTextColor="#8e8e8e"
                />
              </View>
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={prix}
                  onChangeText={setPrix}
                  placeholder="0.00"
                  placeholderTextColor="#8e8e8e"
                  keyboardType="numeric"
                />
                <Text style={styles.suffix}>MAD</Text>
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.inputWrapper}>
                <Text style={[styles.inputText, { color: categorie === 'Main Course' && !isEditing ? '#8e8e8e' : '#121414' }]}>{categorie}</Text>
                <Ionicons name="chevron-down" size={16} color="#ff7a00" />
              </TouchableOpacity>
            </View>

            {/* Dish Image */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dish Image</Text>
              <TouchableOpacity style={styles.uploadBox}>
                <Ionicons name="image-outline" size={32} color="#ff7a00" style={styles.uploadIcon} />
                <Text style={styles.uploadPrimaryText}>Upload a file or drag and drop</Text>
                <Text style={styles.uploadSecondaryText}>PNG, JPG up to 10MB</Text>
              </TouchableOpacity>
            </View>

            {/* Availability */}
            <View style={styles.availabilityRow}>
              <View style={styles.availabilityTexts}>
                <Text style={styles.availabilityTitle}>Availability</Text>
                <Text style={styles.availabilitySubtitle}>Is this dish currently available?</Text>
              </View>
              <Switch
                value={disponible}
                onValueChange={setDisponible}
                trackColor={{ false: '#343535', true: '#3b82f6' }}
                thumbColor="#fff"
              />
            </View>

          </View>
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#121414" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="#121414" style={{marginRight: 8}} />
                <Text style={styles.saveButtonText}>Save Dish</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121414',
  },
  flex: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#292a2a',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#e3e2e2',
  },
  formContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  card: {
    backgroundColor: '#1a1c1c',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#292a2a',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#e3e2e2',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    height: 48,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#121414',
    height: '100%',
  },
  inputText: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
  },
  suffix: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#ff7a00',
    marginLeft: 8,
  },
  uploadBox: {
    backgroundColor: '#121414',
    borderWidth: 1,
    borderColor: '#292a2a',
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    marginBottom: 12,
  },
  uploadPrimaryText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#ff7a00',
    marginBottom: 4,
  },
  uploadSecondaryText: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#a78b7c',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  availabilityTexts: {
    flex: 1,
    paddingRight: 16,
  },
  availabilityTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#e3e2e2',
    marginBottom: 4,
  },
  availabilitySubtitle: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#a78b7c',
  },
  ctaContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 16,
    backgroundColor: '#121414',
  },
  saveButton: {
    backgroundColor: '#ff7a00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#121414',
  },
});
