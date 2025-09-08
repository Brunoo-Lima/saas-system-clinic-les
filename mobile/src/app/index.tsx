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
import { TabsLogin } from "@/components/layouts/login/tabs/tabs-login";

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

        <TabsLogin role={role} setRole={setRole} />

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
