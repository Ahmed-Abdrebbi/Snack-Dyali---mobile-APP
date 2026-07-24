import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPlatById, deletePlat } from '../src/api/plats';
import { Spacing } from '@/constants/theme';

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
      Alert.alert('Error', error.message || 'Impossible to delete this dish');
    },
  });

  const handleDelete = () => {
    Alert.alert(
      'Delete Dish',
      `Are you sure you want to delete "${plat?.nom}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(),
        },
      ]
    );
  };

  if (isLoading || !plat) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff7a00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header Image */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1000' }}
          style={[styles.headerImage, { paddingTop: insets.top || (Platform.OS === 'web' ? 16 : 48) }]}
          imageStyle={styles.headerImageBg}
        >
          {/* Dark overlay for readability */}
          <View style={styles.imageOverlay} />
          
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#e3e2e2" />
            <Text style={styles.backText}>Menu</Text>
          </TouchableOpacity>

          <View style={styles.badgeContainer}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>{plat.disponible ? 'AVAILABLE' : 'UNAVAILABLE'}</Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.dishName}>{plat.nom}</Text>
          <Text style={styles.dishPrice}>{plat.prix} MAD</Text>

          {/* Description Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>DESCRIPTION</Text>
            <Text style={styles.descriptionText}>
              Classic French-style taco loaded with tender grilled chicken breast, our signature secret sauce, crispy fries, and a rich blend of melted gruyère and cheddar cheese, all wrapped in a freshly pressed flour tortilla.
            </Text>
          </View>

          {/* Details Card */}
          <View style={styles.card}>
            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <Ionicons name="layers-outline" size={18} color="#ff7a00" />
                <Text style={styles.detailLabel}>Category</Text>
              </View>
              <Text style={styles.detailValue}>{plat.categorie || 'Main Course'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <View style={styles.detailRowLeft}>
                <Ionicons name="time-outline" size={18} color="#ff7a00" />
                <Text style={styles.detailLabel}>Prep Time</Text>
              </View>
              <Text style={styles.detailValue}>10-15 mins</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom || 24 }]}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push({ pathname: '/modal', params: { id: plat.id } })}
        >
          <Ionicons name="pencil-outline" size={18} color="#ff7a00" />
          <Text style={styles.editButtonText}>EDIT DISH</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? (
            <ActivityIndicator color="#690006" size="small" />
          ) : (
            <>
              <Ionicons name="trash-outline" size={18} color="#690006" />
              <Text style={styles.deleteButtonText}>DELETE DISH</Text>
            </>
          )}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121414',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 300,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 20,
  },
  headerImageBg: {
    opacity: 0.8,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    zIndex: 10,
  },
  backText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#e3e2e2',
    marginLeft: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 20, 20, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    zIndex: 10,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff7a00',
    marginRight: 6,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#e3e2e2',
    letterSpacing: 1,
  },
  content: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 20,
  },
  dishName: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#e3e2e2',
    marginBottom: 4,
  },
  dishPrice: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: '#ff7a00',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1a1c1c',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#292a2a',
  },
  cardLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#ff7a00',
    letterSpacing: 1,
    marginBottom: 12,
  },
  descriptionText: {
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 22,
    color: '#e3e2e2',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#e3e2e2',
  },
  detailValue: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#e3e2e2',
  },
  divider: {
    height: 1,
    backgroundColor: '#292a2a',
    marginVertical: 16,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: 16,
    backgroundColor: '#121414',
    borderTopWidth: 1,
    borderTopColor: '#292a2a',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff7a00',
    backgroundColor: 'transparent',
    gap: 8,
  },
  editButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#ff7a00',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#ffb4ac', // Light red from design system
    gap: 8,
  },
  deleteButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#690006', // Dark red from design system
  },
});
