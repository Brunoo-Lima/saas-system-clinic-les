import { ScrollView, View } from "react-native";
import styles from "./styles";
import { appointmentList } from "@/mocks/appointment-list";
import Header from "@/components/header/header";
import { Card } from "./card/card";
import { SafeAreaView } from "react-native-safe-area-context";

export const Appointment = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Agendamentos" />

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          {appointmentList.map((appointment) => (
            <Card key={appointment.id} appointment={appointment} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
