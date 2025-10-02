import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { IConsultation } from '@/@types/IConsultation';

interface ICardProps {
  consultation: IConsultation;
  onOpenModal: (id: number) => void;
}

export const Card = ({ consultation, onOpenModal }: ICardProps) => {
  const getStatus = () => {
    switch (consultation.status) {
      case 'completed':
        return 'Realizada';
      case 'canceled':
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.patient}>
        Paciente: <Text style={styles.patientName}>{consultation.patient}</Text>
      </Text>
      <Text style={styles.status}>
        Status: <Text style={styles.statusText}>{getStatus()}</Text>
      </Text>

      <View style={styles.info}>
        <Text>Data: {consultation.date}</Text>
        <Text>Horário: {consultation.time}</Text>
      </View>

      {consultation.status !== 'completed' && !consultation.orderCancel && (
        <View style={styles.actions}>
          <TouchableOpacity
            disabled={!!consultation.orderCancel}
            style={[styles.action, styles.actionCancel]}
            onPress={() => onOpenModal(consultation.id)}
          >
            <Text style={styles.actionText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}

      {consultation.orderCancel && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, styles.actionPending]}
            disabled
          >
            <Text style={styles.actionText}>Cancelamento solicitado</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
