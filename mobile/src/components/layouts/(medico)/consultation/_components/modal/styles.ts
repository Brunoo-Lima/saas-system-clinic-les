import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    height: 'auto',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#155dfb',
    alignItems: 'center',
  },

  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },

  modalAttention: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  modalButton: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  modalAccept: {
    backgroundColor: '#009689',
    padding: 8,
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  modalCancel: {
    backgroundColor: '#ff0000',
    padding: 8,
    borderRadius: 8,
    width: 80,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
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
