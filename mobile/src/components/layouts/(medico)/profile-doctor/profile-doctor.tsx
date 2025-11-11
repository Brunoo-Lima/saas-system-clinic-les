import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { Input } from '@/components/ui/input/input';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/(doctor)/user-context';

export default function ProfileDoctor() {
  const { doctor } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" />

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=2' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.text}>Nome: {doctor?.name}</Text>
        <Text style={styles.text}>CRM: {doctor?.crm}</Text>
        <Text style={styles.text}>Email: {doctor?.user.email}</Text>
      </View>
    </SafeAreaView>
  );
}
