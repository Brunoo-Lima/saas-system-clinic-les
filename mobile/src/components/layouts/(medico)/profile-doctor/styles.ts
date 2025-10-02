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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
  },

  button: {
    marginTop: 18,
    backgroundColor: '#2b6cb0',
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    maxWidth: 250,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default styles;
