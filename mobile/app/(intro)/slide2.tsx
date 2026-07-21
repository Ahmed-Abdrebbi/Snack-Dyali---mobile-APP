import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { StitchButton } from '@/components/StitchComponents';
import { useIntroductionStatus } from '@/hooks/useIntroductionStatus';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function Slide2Screen() {
  const router = useRouter();
  const { markAsSeen } = useIntroductionStatus();

  const handleGetStarted = async () => {
    await markAsSeen();
    router.replace('/(tabs)/menu' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="sync-circle-outline" size={80} color={Colors.dark.primary} />
        </View>
        
        <Text style={[Typography.headlineLgMobile, { color: Colors.dark.text, marginTop: Spacing.xl, textAlign: 'center' }]}>
          Always Updated
        </Text>
        <Text style={[Typography.bodyLg, { color: Colors.dark.textDim, marginTop: Spacing.md, textAlign: 'center' }]}>
          Keep your kitchen and front-of-house in perfect sync with real-time updates.
        </Text>
      </View>

      <View style={styles.footer}>
        <StitchButton title="Get Started" variant="primary" onPress={handleGetStarted} style={{ flex: 1 }} />
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
  iconContainer: {
    width: 120,
    height: 120,
    backgroundColor: Colors.dark.surfaceRaised,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
