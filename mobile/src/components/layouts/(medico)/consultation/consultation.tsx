import { ScrollView, Text, View, TouchableOpacity } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { Card } from './card/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useGetAppointments,
  useUpdateStatusSchedulingDoctor,
} from '../../../../services/doctor/appointment-service';
import { IAppointmentReturn } from '../../../../services/doctor/appointment-service';
import { useAuth } from '@/contexts/(doctor)/user-context';
import { ErrorConsultation } from './_components/error-consultation';
import { ModalCancel } from './_components/modal/modal-cancel';

export default function Consultation() {
  const { doctor } = useAuth();
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAppointments({ doctor_id: doctor?.id });
  const { mutate: cancelAppointment, isPending: isCanceling } =
    useUpdateStatusSchedulingDoctor();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    setIsOpenModal(false);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;
    setIsProcessing(true);

    try {
      const payload = {
        id: selectedAppointmentId,
        status: 'CANCEL_PENDING',
        doctor: {
          id: doctor?.id ?? '',
        },
      };

      console.log('Payload cancelamento:', payload);

      cancelAppointment(
        {
          id: selectedAppointmentId,
          status: 'CANCEL_PENDING',
          doctor: {
            id: doctor?.id ?? '',
          },
        },
        {
          onSuccess: () => {
            Toast.show({
              type: 'success',
              text1: 'Sucesso!',
              text2: 'A solicitação de cancelamento foi enviada com sucesso.',
              visibilityTime: 2000,
            });
          },
        },
      );
    } finally {
      setIsProcessing(false);
      handleCloseModal();
    }
  };

  const handleUpdateList = () => {
    refetch();
  };

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

  if (error) return <ErrorConsultation refetch={refetch} />;

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

  const sortedAppointments = [...(appointments || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Consultas" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerAction}>
          <Text style={styles.title}>Consultas</Text>

          <TouchableOpacity
            onPress={handleUpdateList}
            disabled={isFetching}
            style={[styles.button, isFetching && { opacity: 0.6 }]}
          >
            <Text style={styles.retryButtonText}>
              {isFetching ? 'Atualizando...' : 'Atualizar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {sortedAppointments.map((appointment: IAppointmentReturn) => (
            <Card
              key={appointment.id}
              consultation={appointment}
              onOpenModal={() => handleOpenModal(appointment.id)}
              isCanceling={
                isCanceling && selectedAppointmentId === appointment.id
              }
            />
          ))}
        </View>
      </ScrollView>

      <ModalCancel
        handleCloseModal={handleCloseModal}
        handleConfirmCancel={handleConfirmCancel}
        isOpenModal={isOpenModal}
        isProcessing={isProcessing}
      />
    </SafeAreaView>
  );
}
