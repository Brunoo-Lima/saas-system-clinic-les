import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { LogOutIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import styles from "./styles";

interface IHeaderProps {
  title: string;
}

export default function Header({ title }: IHeaderProps) {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>{title}</Text>

        <TouchableOpacity
          style={styles.logout}
          onPress={() => router.push("/")}
        >
          <LogOutIcon size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
