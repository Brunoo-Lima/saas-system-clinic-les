import { Text, View } from "react-native";
import { LogOutIcon } from "lucide-react";
import styles from "./styles";

export default function ProfilePatient() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil do paciente</Text>

      <LogOutIcon />
    </View>
  );
}
