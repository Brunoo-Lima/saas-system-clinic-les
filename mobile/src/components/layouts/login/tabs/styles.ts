import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#eef3f6",
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: "#2b6cb0",
  },
  tabText: {
    fontWeight: "600",
    color: "#2b6cb0",
  },
  tabTextActive: {
    color: "#fff",
  },
});

export default styles;
