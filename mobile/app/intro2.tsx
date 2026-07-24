import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function Intro2Screen() {
  const router = useRouter();

  const handleFinish = async () => {
    await AsyncStorage.setItem('has_seen_intro', 'true');
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Header for SKIP */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleFinish}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/snack-dyali-text-logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.headlineText}>Always Updated.</Text>
          <Text style={styles.headlineTextSecondary}>Even Offline.</Text>
          <Text style={styles.subtitleText}>
            Manage your dishes instantly. We handle the technology, you handle the craft.
          </Text>
        </View>

        {/* Button Section */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleFinish}
          >
            <Text style={styles.buttonText}>START MANAGING</Text>
          </TouchableOpacity>

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure black background
  },
  header: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    alignItems: 'flex-end',
  },
  skipText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#ffb68b', // primary color
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl * 2,
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoImage: {
    width: width * 0.8,
    height: width * 0.8,
    maxWidth: 350,
    maxHeight: 350,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headlineText: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#e3e2e2',
    marginBottom: 4,
  },
  headlineTextSecondary: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#95ccff', // Tertiary color from design system or light blue to match image
    marginBottom: 16,
  },
  subtitleText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#e0c0af',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#ff7a00',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#ff7a00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#5c2800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#343535',
  },
  activeDot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff7a00',
  },
});
