import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface IModalCancelProps {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  handleConfirmCancel: () => void;
  isProcessing?: boolean;
}

export const ModalCancel = ({
  isOpenModal,
  handleCloseModal,
  handleConfirmCancel,
  isProcessing,
}: IModalCancelProps) => {
  return (
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
              isProcessing && styles.buttonDisabled,
            ]}
            onPress={handleConfirmCancel}
            disabled={isProcessing}
          >
            <Text style={styles.modalButtonText}>
              {isProcessing ? <ActivityIndicator /> : 'Sim'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalCancel]}
            onPress={handleCloseModal}
            disabled={isProcessing}
          >
            <Text style={styles.modalButtonText}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
