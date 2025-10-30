import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { IAppointmentReturn } from '../../../../../../services/appointment-service';

interface ICardProps {
  consultation: IAppointmentReturn;
  onOpenModal: (consultation: IAppointmentReturn) => void;
  isCanceling?: boolean;
}

export const Card = ({
  consultation,
  onOpenModal,
  isCanceling,
}: ICardProps) => {
  const getStatus = () => {
    switch (consultation.status) {
      case 'CONCLUDE':
        return 'Realizada';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  };

  // Verifica se pode cancelar (não completada e não cancelada)
  const canCancel =
    consultation.status !== 'CONCLUDE' && consultation.status !== 'CANCELLED';

  return (
    <View style={styles.card}>
      <Text style={styles.patient}>
        Paciente:{' '}
        <Text style={styles.patientName}>{consultation.patient.name}</Text>
      </Text>
      <Text style={styles.status}>
        Status: <Text style={styles.statusText}>{getStatus()}</Text>
      </Text>

      <View style={styles.info}>
        <Text>
          Data: {new Date(consultation.date).toLocaleDateString('pt-BR')}
        </Text>
        <Text>
          Horário:{' '}
          {new Date(consultation.date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {canCancel && consultation.status !== 'CANCELLED' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.action,
              styles.actionCancel,
              isCanceling && styles.buttonDisabled,
            ]}
            onPress={() => onOpenModal(consultation)}
            disabled={isCanceling}
          >
            <Text style={styles.actionText}>
              {isCanceling ? 'Cancelando...' : 'Cancelar Consulta'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {consultation.status === 'PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, styles.actionPending]}
            disabled
          >
            <Text style={styles.actionText}>Cancelamento solicitado</Text>
          </TouchableOpacity>
        </View>
      )}

      {consultation.status === 'CANCELLED' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, styles.actionDisabled]}
            disabled
          >
            <Text style={styles.actionText}>Consulta Cancelada</Text>
          </TouchableOpacity>
        </View>
      )}

      {consultation.status === 'CONCLUDE' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, styles.actionCompleted]}
            disabled
          >
            <Text style={styles.actionText}>Consulta Realizada</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
