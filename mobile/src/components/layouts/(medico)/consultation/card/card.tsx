import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { IAppointmentReturn } from '../../../../../services/doctor/appointment-service';

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
  const getStatusLabel = () => {
    switch (consultation.status) {
      case 'CONCLUDE':
        return { label: 'Realizada', color: '#10B981' };
      case 'CANCELED':
        return { label: 'Cancelada', color: '#EF4444' };
      case 'CONFIRMED':
        return { label: 'Confirmada', color: '#3B82F6' };
      case 'CANCEL_PENDING':
        return { label: 'Cancelamento solicitado', color: '#FFD166' };
      default:
        return { label: 'Pendente', color: '#F59E0B' };
    }
  };

  // Verifica se pode cancelar (não completada e não cancelada)
  const canCancel =
    consultation.status !== 'CONCLUDE' && consultation.status !== 'CANCELED';

  const statusInfo = getStatusLabel();

  return (
    <View style={styles.card}>
      <Text style={styles.patient}>
        Paciente:{' '}
        <Text style={styles.patientName}>{consultation.patient.name}</Text>
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.label}
        </Text>
      </View>

      <View style={styles.info}>
        <Text>
          Data: {new Date(consultation.date).toLocaleDateString('pt-BR')}
        </Text>
        <Text>
          Horário:{' '}
          {new Date(consultation.date.replace('Z', '')).toLocaleTimeString(
            'pt-BR',
            {
              hour: '2-digit',
              minute: '2-digit',
            },
          )}
        </Text>
      </View>

      {canCancel &&
        consultation.status !== 'CANCELED' &&
        consultation.status !== 'CANCEL_PENDING' && (
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

      {consultation.status === 'CANCEL_PENDING' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, styles.actionPending]}
            disabled
          >
            <Text style={styles.actionText}>Cancelamento solicitado</Text>
          </TouchableOpacity>
        </View>
      )}

      {consultation.status === 'CANCELED' && (
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
