import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

interface IModalActionProps {
  isOpenModal: boolean;
  handleCloseModal: () => void;
  handleConfirmCancel: () => void;
  handleConfirmConsultation: () => void;
  isProcessing: boolean;
  actionType: 'cancel' | 'confirm';
  isLoading?: boolean;
}

export const ModalAction = ({
  isOpenModal,
  handleCloseModal,
  handleConfirmCancel,
  handleConfirmConsultation,
  isProcessing,
  actionType,
  isLoading,
}: IModalActionProps) => {
  const isCancelAction = actionType === 'cancel';
  const title = isCancelAction
    ? 'Tem certeza que deseja cancelar esta consulta?'
    : 'Deseja confirmar esta consulta?';

  const subtitle = isCancelAction
    ? 'Será enviada uma solicitação para a clínica realizar o cancelamento.'
    : 'Ao confirmar, a consulta será marcada como confirmada.';

  const handleConfirm = isCancelAction
    ? handleConfirmCancel
    : handleConfirmConsultation;

  return (
    <Modal visible={isOpenModal} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={handleCloseModal} />

      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>{title}</Text>
        <Text style={styles.modalAttention}>{subtitle}</Text>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[
              styles.modalButton,
              styles.modalAccept,
              isProcessing && styles.buttonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={isProcessing}
          >
            <Text style={styles.modalButtonText}>
              {isLoading ? <ActivityIndicator color="#fff" /> : 'Sim'}
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
