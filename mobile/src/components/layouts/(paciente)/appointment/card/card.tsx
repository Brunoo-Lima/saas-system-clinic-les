import { Text, TouchableOpacity, View } from 'react-native';
import { CheckIcon, XIcon } from 'lucide-react-native';
import styles from './styles';
import { IAppointmentReturn } from '@/services/doctor/appointment-service';

type ModalAction = 'cancel' | 'confirm';

interface ICardProps {
  appointment: IAppointmentReturn;
  onOpenModal: (action: ModalAction, appointmentId: string) => void;
}

export const Card = ({ appointment, onOpenModal }: ICardProps) => {
  const getStatusLabel = () => {
    switch (appointment.status) {
      case 'CONCLUDE':
        return { label: 'Realizada', color: '#10B981' };
      case 'CANCELED':
        return { label: 'Cancelada', color: '#EF4444' };
      case 'CONFIRMED':
        return { label: 'Confirmada', color: '#3B82F6' };
      default:
        return { label: 'Pendente', color: '#F59E0B' };
    }
  };

  const statusInfo = getStatusLabel();

  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        Médico: <Text style={styles.value}>{appointment.doctor.name}</Text>
      </Text>

      <Text style={styles.label}>
        Paciente: <Text style={styles.value}>{appointment.patient.name}</Text>
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Data: {new Date(appointment.date).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.infoText}>
          Horário:{' '}
          {new Date(appointment.date.replace('Z', '')).toLocaleTimeString(
            'pt-BR',
            {
              hour: '2-digit',
              minute: '2-digit',
            },
          )}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => onOpenModal('cancel', appointment.id)}
        >
          <XIcon size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={() => onOpenModal('confirm', appointment.id)}
        >
          <CheckIcon size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
