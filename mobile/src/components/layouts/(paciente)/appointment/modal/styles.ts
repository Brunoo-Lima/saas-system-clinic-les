import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  modalText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
    color: '#F9FAFB',
    fontWeight: '600',
  },

  modalAttention: {
    fontSize: 13,
    marginBottom: 20,
    textAlign: 'center',
    color: '#E0E7FF',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },

  modalButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 10,
    borderRadius: 8,
    width: 90,
    alignItems: 'center',
  },

  modalAccept: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
    width: 90,
    alignItems: 'center',
  },

  modalCancel: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
    width: 90,
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  buttonDisabled: {
    opacity: 0.5,
  },
});

export default styles;
