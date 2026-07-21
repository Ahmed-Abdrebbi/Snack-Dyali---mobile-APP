import { Redirect } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useIntroductionStatus } from '@/hooks/useIntroductionStatus';
import { Colors } from '@/constants/theme';

export default function RootIndex() {
  const { isIntroSeen } = useIntroductionStatus();

  if (isIntroSeen === null) {
    // Show a loading indicator while checking AsyncStorage
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
      </View>
    );
  }

  if (!isIntroSeen) {
    return <Redirect href={"/(intro)/slide1" as any} />;
  }

  return <Redirect href={"/(tabs)/menu" as any} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
