import { theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderRadius: theme.radius,
    backgroundColor: theme.muted,
    padding: 4,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.radius - 2,
  },

  tabActive: {
    backgroundColor: theme.primary,
  },

  tabText: {
    fontWeight: '600',
    color: theme.primary,
  },

  tabTextActive: {
    color: theme.primaryForeground,
  },
});

export default styles;
