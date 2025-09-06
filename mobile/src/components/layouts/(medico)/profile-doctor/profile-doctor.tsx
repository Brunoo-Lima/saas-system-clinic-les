import { View } from "react-native";
import styles from "./styles";
import Header from "@/components/header/header";

export default function ProfileDoctor() {
  return (
    <View style={styles.container}>
      <Header title="Perfil" />

      <View style={styles.content}></View>
    </View>
  );
}
