import { Text, TouchableOpacity, View } from "react-native";
import { CheckIcon, XIcon } from "lucide-react-native";
import styles from "./styles";
import { IAppointment } from "@/@types/IAppointment";

interface ICardProps {
  appointment: IAppointment;
}

export const Card = ({ appointment }: ICardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.doctor}>
        Médico: <Text style={styles.doctorName}>{appointment.doctor}</Text>
      </Text>
      <Text style={styles.status}>
        Status: <Text style={styles.statusText}>{appointment.status}</Text>
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
  );
};
