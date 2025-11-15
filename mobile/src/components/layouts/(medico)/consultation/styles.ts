import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  headerAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.foreground,
  },

  button: {
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  buttonText: {
    color: theme.card,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.card,
    height: '100%',
    width: '100%',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 42,
  },

  scroll: {
    paddingTop: 32,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.muted,
  },

  errorText: {
    fontSize: 16,
    color: theme.destructive,
    textAlign: 'center',
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 16,
    color: theme.muted,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: theme.ring,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryButtonText: {
    color: theme.card,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
