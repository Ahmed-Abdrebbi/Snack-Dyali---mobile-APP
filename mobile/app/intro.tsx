import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Spacing } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function IntroScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/intro2');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.contentContainer}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/images/snack-dyali-logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>WELCOME TO</Text>
          <Text style={styles.brandText}>SNACK DYALI</Text>
          <Text style={styles.subtitleText}>
            Your curated guide to hand-crafted local flavors and the finest snacks.
          </Text>
        </View>

        {/* Button Section */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>GET STARTED</Text>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl * 2,
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 40,
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
  welcomeText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#e3e2e2', // on_surface color
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  brandText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '800',
    color: '#ffb68b', // primary color or use #ff7a00
    letterSpacing: 2,
    marginBottom: 16,
  },
  subtitleText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#e0c0af', // on_surface_variant
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
  button: {
    width: '100%',
    backgroundColor: '#ff7a00', // primary_container color
    paddingVertical: 18,
    borderRadius: 30, // Or Rounded.xl depending on constants
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
    fontSize: 16,
    fontWeight: '700',
    color: '#5c2800', // on_primary_container color
    letterSpacing: 1,
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
    backgroundColor: '#343535', // surface_variant
  },
  activeDot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff7a00', // active color
  },
});
