import { Text, ScrollView, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import { appointmentList } from "@/mocks/appointment-list";
import { CheckIcon, XIcon } from "lucide-react-native";
import Header from "@/components/header/header";
import { Card } from "./card/card";

export const Appointment = () => {
  return (
    <View style={styles.container}>
      <Header title="Agendamentos" />

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          {appointmentList.map((appointment) => (
            <Card key={appointment.id} appointment={appointment} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
