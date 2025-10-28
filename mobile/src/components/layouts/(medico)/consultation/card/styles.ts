import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    width: 300,
    maxWidth: 300,
    backgroundColor: '#fafafa',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 8px',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    flexDirection: 'column',
  },

  patient: {
    fontSize: 16,
    fontWeight: 400,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 600,
  },
  status: {
    fontSize: 16,
    fontWeight: 400,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 600,
  },

  info: {
    borderTopWidth: 1,
    borderTopColor: '#e4e7eb',
    paddingTop: 12,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  actions: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  action: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionCancel: {
    backgroundColor: '#dc2626',
  },
  actionPending: {
    backgroundColor: '#f59e0b',
  },
  actionDisabled: {
    backgroundColor: '#9ca3af',
  },
  actionCompleted: {
    backgroundColor: '#16a34a',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default styles;
