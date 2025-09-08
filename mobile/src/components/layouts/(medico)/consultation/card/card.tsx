import { Text, TouchableOpacity, View } from "react-native";
import { XIcon } from "lucide-react-native";
import styles from "./styles";
import { IConsultation } from "@/@types/IConsultation";

interface ICardProps {
  consultation: IConsultation;
}

export const Card = ({ consultation }: ICardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.patient}>
        Paciente: <Text style={styles.patientName}>{consultation.patient}</Text>
      </Text>
      <Text style={styles.status}>
        Status: <Text style={styles.statusText}>{consultation.status}</Text>
      </Text>

      <View style={styles.info}>
        <Text>Data: {consultation.date}</Text>
        <Text>Horário: {consultation.time}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.action, styles.actionCancel]}>
          <XIcon size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
