import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextInput,
  Animated,
  ViewStyle,
} from 'react-native';
import { Colors, Typography, Rounded, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

/* ─────────────── STITCH BUTTON ─────────────── */

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'destructive' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export const StitchButton = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: ButtonProps) => {
  const getStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: Colors.dark.primary,
          text: Colors.dark.primaryText,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: Colors.dark.primary,
          border: Colors.dark.primary,
          borderWidth: 1.5,
        };
      case 'destructive':
        return {
          bg: Colors.dark.secondary,
          text: Colors.dark.secondaryText,
          border: 'transparent',
          borderWidth: 0,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: Colors.dark.primary,
          border: 'transparent',
          borderWidth: 0,
        };
    }
  };

  const s = getStyle();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? Colors.dark.toggleInactive : s.bg,
          borderColor: s.border,
          borderWidth: s.borderWidth,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text
        style={[
          Typography.labelLg,
          { color: disabled ? Colors.dark.textDisabled : s.text, textAlign: 'center' },
        ]}
      >
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
};

/* ─────────────── STITCH CARD ─────────────── */

export const StitchCard = ({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: ViewStyle;
}) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

/* ─────────────── STITCH BADGE ─────────────── */

export const StitchBadge = ({
  title,
  status,
}: {
  title: string;
  status: 'success' | 'warning' | 'error';
}) => {
  const getColors = () => {
    switch (status) {
      case 'success':
        return { bg: 'rgba(212, 175, 55, 0.15)', text: Colors.dark.primary };
      case 'error':
        return { bg: 'rgba(229, 57, 53, 0.15)', text: Colors.dark.secondary };
      case 'warning':
        return { bg: 'rgba(255, 152, 0, 0.15)', text: '#FF9800' };
    }
  };
  const { bg, text } = getColors();
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text
        style={[Typography.labelSm, { color: text, textTransform: 'uppercase' }]}
      >
        {title}
      </Text>
    </View>
  );
};

/* ─────────────── STITCH INPUT ─────────────── */

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  suffix?: string;
}

export const StitchInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  suffix,
}: InputProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          Typography.labelMd,
          { color: Colors.dark.textMuted, marginBottom: Spacing.xs },
        ]}
      >
        {label.toUpperCase()}
      </Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && { borderColor: Colors.dark.primary },
        ]}
      >
        <TextInput
          style={[styles.input, Typography.bodyLg]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.dark.textDisabled}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {suffix && (
          <Text
            style={[
              Typography.bodyMd,
              { color: Colors.dark.textMuted, marginLeft: Spacing.sm },
            ]}
          >
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
};

/* ─────────────── STITCH TOGGLE ─────────────── */

interface ToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  label?: string;
}

export const StitchToggle = ({ value, onValueChange, label }: ToggleProps) => {
  const translateX = React.useRef(new Animated.Value(value ? 22 : 2)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: value ? 22 : 2,
      useNativeDriver: true,
      friction: 8,
      tension: 80,
    }).start();
  }, [value]);

  return (
    <TouchableOpacity
      style={styles.toggleRow}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
    >
      {label && (
        <Text
          style={[
            Typography.bodyMd,
            { color: Colors.dark.textSecondary, marginRight: Spacing.md },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.toggleTrack,
          {
            backgroundColor: value
              ? Colors.dark.toggleActive
              : Colors.dark.toggleInactive,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.toggleThumb,
            { transform: [{ translateX }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

/* ─────────────── STITCH HEADER ─────────────── */

interface HeaderProps {
  title?: string;
  titleElement?: React.ReactNode;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const StitchHeader = ({
  title,
  titleElement,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {leftIcon && onLeftPress ? (
          <TouchableOpacity onPress={onLeftPress} style={styles.headerIconBtn}>
            <Ionicons name={leftIcon} size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerIconBtn} />
        )}
      </View>
      <View style={styles.headerCenter}>
        {titleElement || (
          <Text style={[Typography.headlineSm, { color: Colors.dark.text }]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      <View style={styles.headerRight}>
        {rightIcon && onRightPress ? (
          <TouchableOpacity onPress={onRightPress} style={styles.headerIconBtn}>
            <Ionicons name={rightIcon} size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerIconBtn} />
        )}
      </View>
    </View>
  );
};

/* ─────────────── STYLES ─────────────── */

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: Spacing.lg,
    borderRadius: Rounded.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Rounded.md,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceBorder,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Rounded.sm,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputWrapper: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.surfaceBorder,
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: Colors.dark.text,
  },
  // Toggle
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.dark.toggleThumb,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.dark.background,
  },
  headerLeft: {
    width: 44,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
