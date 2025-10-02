import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import styles from './styles';
import { consultationList as initialConsultations } from '@/mocks/consultation-list';
import Header from '@/components/header/header';
import { Card } from './card/card';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Consultation() {
  const [consultations, setConsultations] = useState(initialConsultations);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  const handleOpenModal = (id: number) => {
    setOrderToCancel(id);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setOrderToCancel(null);
    setIsOpenModal(false);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel !== null) {
      setConsultations((prev) =>
        prev.map((c) =>
          c.id === orderToCancel ? { ...c, orderCancel: true } : c,
        ),
      );

      Toast.show({
        type: 'success',
        text1: 'Sucesso!',
        text2: 'A solicitação foi enviada com sucesso.',
      });

      handleCloseModal();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Consultas" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {consultations.map((consulta) => (
            <Card
              key={consulta.id}
              consultation={consulta}
              onOpenModal={handleOpenModal}
            />
          ))}
        </View>
      </ScrollView>

      <Modal visible={isOpenModal} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => setIsOpenModal(false)}
        />

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
              style={[styles.modalButton, styles.modalAccept]}
              onPress={handleConfirmCancel}
            >
              <Text style={styles.modalButtonText}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancel]}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Não</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
