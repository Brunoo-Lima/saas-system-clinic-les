import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    width: "100%",
    backgroundColor: "#155dfb",
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logout: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;
