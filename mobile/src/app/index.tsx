import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "./styles";
import { LoginForm } from "@/components/layouts/login/login-form";

type Role = "medico" | "paciente";

export default function LoginScreen() {
  const [role, setRole] = useState<Role>("medico");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.logo}>
          <Image
            source={require("../../assets/icon/logo.webp")}
            style={{ width: 120, height: 120 }}
          />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ selected: role === "medico" }}
            style={[styles.tab, role === "medico" && styles.tabActive]}
            onPress={() => setRole("medico")}
          >
            <Text
              style={[
                styles.tabText,
                role === "medico" && styles.tabTextActive,
              ]}
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
              style={[
                styles.tabText,
                role === "paciente" && styles.tabTextActive,
              ]}
            >
              Paciente
            </Text>
          </TouchableOpacity>
        </View>

        <LoginForm role={role} />

        <View style={styles.rowBetween}>
          <TouchableOpacity>
            <Text style={styles.linkText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
