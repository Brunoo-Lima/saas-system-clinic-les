import { ScrollView, View } from "react-native";
import styles from "./styles";
import { consultationList } from "@/mocks/consultation-list";
import Header from "@/components/header/header";
import { Card } from "./card/card";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Consultation() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Consultas" />

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          {consultationList.map((consulta) => (
            <Card key={consulta.id} consultation={consulta} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
