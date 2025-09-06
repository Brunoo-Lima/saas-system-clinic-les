import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./styles";
import Header from "@/components/header/header";
import { Input } from "@/components/ui/input/input";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileDoctor() {
  const [formData, setFormData] = useState({
    name: "Teste 2",
    email: "Teste2@email.com",
    password: "12345679",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" />

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=2" }}
            style={styles.avatar}
          />
        </View>

        <Input
          label="Nome"
          value={formData.name}
          onChangeText={(e) => setFormData({ ...formData, name: e })}
          placeholder="Digite seu nome"
          keyboardType="default"
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(e) => setFormData({ ...formData, email: e })}
          placeholder="Digite seu email"
          keyboardType="email-address"
        />

        <Input
          label="Senha"
          value={formData.password}
          onChangeText={(e) => setFormData({ ...formData, password: e })}
          placeholder="Digite sua senha"
          keyboardType="default"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
