import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        style={styles.input}
        editable={!loading}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={styles.icon}
        onPress={() => setShowPassword((prev) => !prev)}
      >
        <Ionicons
          name={showPassword ? 'eye-off' : 'eye'}
          size={22}
          color="#666"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
});
