import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 18,
    color: theme.foreground,
  },

  input: {
    borderWidth: 1,
    borderColor: theme.input,
    borderRadius: theme.radius,
    paddingHorizontal: 12,
  },

  errorText: {
    color: theme.destructive,
    marginTop: 6,
  },

  button: {
    marginTop: 18,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    borderRadius: theme.radius,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: theme.primaryForeground,
    fontWeight: '700',
  },
});

export default styles;
