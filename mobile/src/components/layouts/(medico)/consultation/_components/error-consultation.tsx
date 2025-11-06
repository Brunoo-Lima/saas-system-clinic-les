import Header from '@/components/header/header';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles';

interface IErrorConsultationProps {
  refetch: () => void;
}

export const ErrorConsultation = ({ refetch }: IErrorConsultationProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Consultas" />
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>Erro ao carregar consultas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
