import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Header from '@/components/header/header';
import { Card } from './card/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthPatient } from '@/contexts/patient/patient-context';
import { useGetAppointments } from '@/services/doctor/appointment-service';
import { useState } from 'react';
import { ModalAction } from './modal/modal';
import { useUpdateStatusScheduling } from '@/services/patient/appointment-patient-service';

export const Appointment = () => {
  const { patient } = useAuthPatient();
  const {
    data: appointments,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAppointments({ patient_id: patient?.id });

  const { mutate: updateScheduling, isPending: isLoadingStatus } =
    useUpdateStatusScheduling();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<'cancel' | 'confirm'>(
    'cancel',
  );
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOpenModal = (
    type: 'cancel' | 'confirm',
    appointmentId: string,
  ) => {
    setModalAction(type);
    setSelectedAppointmentId(appointmentId);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedAppointmentId(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointmentId) return;
    setIsProcessing(true);
    try {
      updateScheduling({
        id: selectedAppointmentId,
        status: 'CANCELED',
        patient: {
          id: patient?.id ?? '',
        },
      });

      await refetch();
    } finally {
      setIsProcessing(false);
      handleCloseModal();
    }
  };

  const handleConfirmConsultation = async () => {
    if (!selectedAppointmentId) return;

    setIsProcessing(true);

    try {
      updateScheduling({
        id: selectedAppointmentId,
        status: 'CONFIRMED',
        patient: {
          id: patient?.id ?? '',
        },
      });

      await refetch();
    } finally {
      setIsProcessing(false);
      handleCloseModal();
    }
  };

  const handleUpdateList = () => {
    refetch();
  };

  if (!appointments || appointments.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Consultas" />
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>Nenhum agendamento encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sortedAppointments = [...(appointments || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Agendamentos" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerAction}>
          <Text style={styles.title}>Consultas</Text>

          <TouchableOpacity
            onPress={handleUpdateList}
            disabled={isFetching}
            style={[styles.button]}
          >
            <Text style={styles.buttonText}>
              {isFetching ? 'Atualizando...' : 'Atualizar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {sortedAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              appointment={appointment}
              onOpenModal={handleOpenModal}
            />
          ))}
        </View>
      </ScrollView>

      <ModalAction
        isOpenModal={isOpenModal}
        handleCloseModal={handleCloseModal}
        handleConfirmCancel={handleConfirmCancel}
        handleConfirmConsultation={handleConfirmConsultation}
        isProcessing={isProcessing}
        actionType={modalAction}
        isLoading={isLoadingStatus}
      />
    </SafeAreaView>
  );
};
