import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    padding: 20,
    borderRadius: theme.radius,
    backgroundColor: theme.primary,
    alignItems: 'center',
  },

  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.primaryForeground,
  },

  modalAttention: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: theme.primaryForeground,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },

  modalButton: {
    backgroundColor: theme.card,
    padding: 8,
    borderRadius: theme.radius,
    width: 80,
    alignItems: 'center',
  },

  modalAccept: {
    backgroundColor: theme.success,
    padding: 8,
    borderRadius: theme.radius,
    width: 80,
    alignItems: 'center',
  },

  modalCancel: {
    backgroundColor: theme.destructive,
    padding: 8,
    borderRadius: theme.radius,
    width: 80,
    alignItems: 'center',
  },

  modalButtonText: {
    color: theme.card,
    fontSize: 16,
    fontWeight: 'bold',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});

export default styles;
