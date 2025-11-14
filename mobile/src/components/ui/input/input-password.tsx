import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

interface InputPasswordProps {
  value: string;
  onChange: (text: string) => void;
  onBlur: () => void;
  loading?: boolean;
}

export function InputPassword({
  value,
  onChange,
  onBlur,
  loading,
}: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        placeholder="Sua senha"
        secureTextEntry={!showPassword}
        editable={!loading}
        placeholderTextColor={theme.mutedForeground}
        style={[styles.input, styles.placeholder]}
      />

      <TouchableOpacity
        style={styles.icon}
        onPress={() => setShowPassword((prev) => !prev)}
      >
        <Ionicons
          name={showPassword ? 'eye-off' : 'eye'}
          size={22}
          color={theme.mutedForeground}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },

  input: {
    width: '100%',
    padding: 12,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: theme.input,
    borderRadius: theme.radius,
    fontSize: 16,
    backgroundColor: theme.card,
    color: theme.foreground,
  },
  placeholder: {
    fontSize: 14,
  },
  icon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
});
