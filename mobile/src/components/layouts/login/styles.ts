import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e4e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  errorText: {
    color: "#e53935",
    marginTop: 6,
  },
  button: {
    marginTop: 18,
    backgroundColor: "#2b6cb0",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});

export default styles;
