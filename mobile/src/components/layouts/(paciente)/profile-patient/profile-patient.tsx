import { Image, Text, View } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthPatient } from '@/contexts/patient/patient-context';

export default function ProfilePatient() {
  const { patient } = useAuthPatient();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" />

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
            style={styles.avatar}
          />
        </View>

        <Text style={styles.text}>Nome: {patient?.name}</Text>
        {/* <Text style={styles.text}>CRM: {patient?.crm}</Text> */}
        <Text style={styles.text}>Email: {patient?.user.email}</Text>
      </View>
    </SafeAreaView>
  );
}
