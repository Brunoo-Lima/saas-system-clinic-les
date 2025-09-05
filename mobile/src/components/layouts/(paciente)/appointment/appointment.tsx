import {
  StatusBar,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import styles from "./styles";
import { appointmentList } from "@/mocks/appointment-list";
import { CheckIcon, LogOutIcon, XIcon } from "lucide-react";

export const Appointment = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="#4F46E5"
        // barStyle={statusBarStyle}
        // showHideTransition={statusBarTransition}
        // hidden={hidden}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendamentos</Text>

        <TouchableOpacity style={styles.logout}>
          <LogOutIcon size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        <View style={styles.content}>
          {appointmentList.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <Text style={styles.doctor}>
                Médico:{" "}
                <Text style={styles.doctorName}>{appointment.doctor}</Text>
              </Text>
              <Text style={styles.status}>
                Status:{" "}
                <Text style={styles.statusText}>{appointment.status}</Text>
              </Text>

              <View style={styles.info}>
                <Text>Data: {appointment.date}</Text>
                <Text>Horário: {appointment.time}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={[styles.action, styles.actionCancel]}>
                  <XIcon size={24} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.action}>
                  <CheckIcon size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
