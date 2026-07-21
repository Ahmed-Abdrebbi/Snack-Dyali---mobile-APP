import { Stack } from 'expo-router';

export default function IntroLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade', // Smooth transitions for intro slides
      }}
    >
      <Stack.Screen name="slide1" />
      <Stack.Screen name="slide2" />
    </Stack>
  );
}
