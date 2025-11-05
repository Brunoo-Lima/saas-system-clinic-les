import { StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { LogOutIcon } from 'lucide-react-native';
import styles from './styles';
import { useAuth } from '@/contexts/user-context';

interface IHeaderProps {
  title: string;
}

export default function Header({ title }: IHeaderProps) {
  const { logout, user } = useAuth();

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#155dfb"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{user?.username}</Text>

        <TouchableOpacity style={styles.logout} onPress={logout}>
          <LogOutIcon size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
