import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    width: '100%',
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primaryForeground,
  },

  logout: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
