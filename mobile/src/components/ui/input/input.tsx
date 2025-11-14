import { theme } from '@/styles/theme';
import React from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
} from 'react-native';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  loading?: boolean;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  onBlur,
  placeholder,
  loading = false,
  label,
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.mutedForeground}
        autoCapitalize="none"
        editable={!loading}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '500',
    color: theme.foreground,
  },

  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.input,
    borderRadius: theme.radius,
    fontSize: 16,
    backgroundColor: theme.card,
    color: theme.foreground,
  },
});
