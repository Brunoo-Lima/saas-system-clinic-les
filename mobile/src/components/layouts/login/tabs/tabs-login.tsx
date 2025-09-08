import { View, Text, TouchableOpacity } from "react-native";
import styles from "./styles";

interface ITabsLoginProps {
  role: "medico" | "paciente";
  setRole: (role: "medico" | "paciente") => void;
}

export const TabsLogin = ({ role, setRole }: ITabsLoginProps) => {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: role === "medico" }}
        style={[styles.tab, role === "medico" && styles.tabActive]}
        onPress={() => setRole("medico")}
      >
        <Text
          style={[styles.tabText, role === "medico" && styles.tabTextActive]}
        >
          Médico
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={{ selected: role === "paciente" }}
        style={[styles.tab, role === "paciente" && styles.tabActive]}
        onPress={() => setRole("paciente")}
      >
        <Text
          style={[styles.tabText, role === "paciente" && styles.tabTextActive]}
        >
          Paciente
        </Text>
      </TouchableOpacity>
    </View>
  );
};
