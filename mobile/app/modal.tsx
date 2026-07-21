import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, Rounded } from '@/constants/theme';
import { StitchInput, StitchButton, StitchCard } from '@/components/StitchComponents';

export default function ModalScreen() {
  const router = useRouter();
  
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState(true);

  const handleSave = () => {
    // In a real app, save to backend/state here
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <StitchCard style={styles.formCard}>
          <Text style={[Typography.headlineSm, { color: Colors.dark.text, marginBottom: Spacing.lg }]}>
            Dish Details
          </Text>

          <StitchInput
            label="Dish Name"
            placeholder="e.g. Tajine Kefta"
            value={dishName}
            onChangeText={setDishName}
          />

          <StitchInput
            label="Price (MAD)"
            placeholder="0.00"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <StitchInput
            label="Category"
            placeholder="e.g. Main"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.switchRow}>
            <View>
              <Text style={[Typography.labelMd, { color: Colors.dark.textDim }]}>AVAILABILITY</Text>
              <Text style={[Typography.bodyMd, { color: Colors.dark.text, marginTop: Spacing.xs }]}>
                {available ? 'Currently Available' : 'Out of Stock'}
              </Text>
            </View>
            <Switch
              value={available}
              onValueChange={setAvailable}
              trackColor={{ false: Colors.dark.surfaceRaised, true: Colors.dark.primary }}
              thumbColor={Colors.dark.text}
            />
          </View>
        </StitchCard>

      </ScrollView>

      <View style={styles.footer}>
        <StitchButton
          title="Cancel"
          variant="secondary"
          onPress={() => router.back()}
          style={{ flex: 1, marginRight: Spacing.md }}
        />
        <StitchButton
          title="Save Dish"
          variant="primary"
          onPress={handleSave}
          style={{ flex: 1 }}
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
  scrollContent: {
    padding: Spacing.md,
  },
  formCard: {
    padding: Spacing.lg,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
});
