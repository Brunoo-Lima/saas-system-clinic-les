import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  label: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },

  statusText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },

  info: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  infoText: {
    fontSize: 14,
    color: '#4B5563',
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButton: {
    backgroundColor: '#10B981',
  },

  cancelButton: {
    backgroundColor: '#EF4444',
  },
});

export default styles;
