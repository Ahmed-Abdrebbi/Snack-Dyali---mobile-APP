import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextInput, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Rounded, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
}

export const StitchButton = ({ title, onPress, variant = 'primary', style }: ButtonProps) => {
  let backgroundColor = Colors.dark.primary;
  let textColor = '#000000'; // Dark text on Saffron Orange per Stitch design rules
  let borderColor = 'transparent';

  if (variant === 'secondary') {
    backgroundColor = 'transparent';
    textColor = Colors.dark.text;
    borderColor = Colors.dark.border;
  } else if (variant === 'ghost') {
    backgroundColor = 'transparent';
    textColor = Colors.dark.primary;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, borderWidth: variant === 'secondary' ? 1 : 0 },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[Typography.labelMd, { color: textColor, textAlign: 'center' }]}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};

export const StitchCard = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

export const StitchBadge = ({ title, status }: { title: string; status: 'success' | 'warning' | 'error' }) => {
  const getColors = () => {
    switch (status) {
      case 'success': return { bg: 'rgba(76, 175, 80, 0.15)', text: Colors.dark.success };
      case 'error': return { bg: 'rgba(229, 57, 53, 0.15)', text: Colors.dark.secondary };
      case 'warning': return { bg: 'rgba(255, 122, 0, 0.15)', text: Colors.dark.primary };
    }
  };
  const { bg, text } = getColors();
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[Typography.labelSm, { color: text, textTransform: 'uppercase' }]}>{title}</Text>
    </View>
  );
};

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
}

export const StitchInput = ({ label, value, onChangeText, placeholder, keyboardType = 'default' }: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text style={[Typography.labelMd, { color: Colors.dark.textDim, marginBottom: Spacing.xs }]}>
        {label.toUpperCase()}
      </Text>
      <TextInput
        style={[
          styles.input,
          Typography.bodyMd,
          isFocused && { borderColor: Colors.dark.primary }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.dark.textDim}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: Rounded.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Rounded.DEFAULT,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Rounded.sm,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Rounded.DEFAULT,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.dark.text,
  },
});
