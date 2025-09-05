import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    margin: "auto",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
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

  rowBetween: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  linkText: {
    color: "#2b6cb0",
    fontWeight: "600",
  },
});

export default styles;
