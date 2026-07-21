import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { StitchButton } from '@/components/StitchComponents';
import { useIntroductionStatus } from '@/hooks/useIntroductionStatus';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Slide1Screen() {
  const router = useRouter();
  const { markAsSeen } = useIntroductionStatus();

  const handleSkip = async () => {
    await markAsSeen();
    router.replace('/(tabs)/menu' as any);
  };

  const handleNext = () => {
    router.push('/(intro)/slide2' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Placeholder for Logo */}
        <View style={styles.logoPlaceholder} />

        <Text style={[Typography.headlineLg, { color: Colors.dark.text, marginTop: Spacing.xl, textAlign: 'center' }]}>
          SNACK DYALI
        </Text>
        <Text style={[Typography.bodyLg, { color: Colors.dark.textDim, marginTop: Spacing.md, textAlign: 'center' }]}>
          Restaurant management, synchronized.
        </Text>
      </View>

      <View style={styles.footer}>
        <StitchButton title="Skip" variant="ghost" onPress={handleSkip} style={{ flex: 1, marginRight: Spacing.md }} />
        <StitchButton title="Next" variant="primary" onPress={handleNext} style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.marginDesktop,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: Colors.dark.surfaceRaised,
    borderRadius: 60,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl, // extra padding for bottom
  },
});
