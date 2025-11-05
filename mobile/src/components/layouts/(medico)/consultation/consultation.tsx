import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { Card } from './card/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useGetAppointments,
  useRequestCancelAppointment,
} from '../../../../services/appointment-service';
import { IAppointmentReturn } from '../../../../services/appointment-service';
import { useAuth } from '@/contexts/user-context';

export default function Consultation() {
  const { user } = useAuth();
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
  } = useGetAppointments({ user_id: user?.id });
  const { mutate: cancelAppointment, isPending: isCanceling } =
    useRequestCancelAppointment();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] =
    useState<IAppointmentReturn | null>(null);

  const handleOpenModal = (appointment: IAppointmentReturn) => {
    setAppointmentToCancel(appointment);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setAppointmentToCancel(null);
    setIsOpenModal(false);
  };

  const handleConfirmCancel = () => {
    if (appointmentToCancel) {
      cancelAppointment(
        {
          id: appointmentToCancel.id,
          doctor: {
            id: appointmentToCancel.doctor.id,
          },
        },
        {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: 'Sucesso!',
              text2: 'A solicitação de cancelamento foi enviada com sucesso.',
            });
            handleCloseModal();
            // O TanStack Query automaticamente invalidará o cache e fará refetch
          },
          onError: (error: any) => {
            Toast.show({
              type: 'error',
              text1: 'Erro!',
              text2: error.message || 'Erro ao cancelar consulta.',
            });
          },
        },
      );
    }
  };

  // Estados de loading e error
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Consultas" />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Carregando consultas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Consultas" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Erro ao carregar consultas</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Consultas" />

        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Consultas" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Consultas</Text>

        <View style={styles.content}>
          {appointments.map((appointment: IAppointmentReturn) => (
            <Card
              key={appointment.id}
              consultation={appointment}
              onOpenModal={() => handleOpenModal(appointment)}
              isCanceling={
                isCanceling && appointmentToCancel?.id === appointment.id
              }
            />
          ))}
        </View>
      </ScrollView>

      <Modal visible={isOpenModal} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={handleCloseModal} />

        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Tem certeza que deseja cancelar essa consulta?
          </Text>

          <Text style={styles.modalAttention}>
            Será enviada a solicitação para a clinica para que cancele ao
            confirmar a ação.
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.modalAccept,
                isCanceling && styles.buttonDisabled,
              ]}
              onPress={handleConfirmCancel}
              disabled={isCanceling}
            >
              <Text style={styles.modalButtonText}>
                {isCanceling ? 'Cancelando...' : 'Sim'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancel]}
              onPress={handleCloseModal}
              disabled={isCanceling}
            >
              <Text style={styles.modalButtonText}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
