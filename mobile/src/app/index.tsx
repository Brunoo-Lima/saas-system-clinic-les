import { Button, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl text-red-400">Login</Text>
      <Button title="Entrar" />
    </View>
  );
}
