import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  scroll: {
    paddingInlineEnd: 25,
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
