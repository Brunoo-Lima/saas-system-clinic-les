import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: theme.background,
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: theme.foreground,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.card,
    width: '100%',
    height: '100%',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  scroll: {
    paddingTop: 32,
    paddingBottom: 12,
    height: '100%',
  },

  containerFilter: {
    width: '100%',
    paddingHorizontal: 16,
    justifyContent: 'flex-start',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
});

export default styles;
