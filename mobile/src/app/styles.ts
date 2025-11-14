import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: theme.radius + 4,
    padding: 20,
  },

  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    alignSelf: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: theme.foreground,
  },

  rowBetween: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  linkText: {
    color: theme.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
