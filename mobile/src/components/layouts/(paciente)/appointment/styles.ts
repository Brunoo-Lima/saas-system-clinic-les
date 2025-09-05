import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    height: 56,
    width: "100%",
    backgroundColor: "#155dfb",
    padding: 12,
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

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    height: "100%",
    gap: 16,
    paddingVertical: 16,
  },

  scroll: {
    paddingInlineEnd: 25,
  },

  card: {
    width: 300,
    maxWidth: 300,
    backgroundColor: "#fafafa",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    borderRadius: 12,
    padding: 20,
    elevation: 6,

    flexDirection: "column",
  },

  doctor: {
    fontSize: 16,
    fontWeight: 400,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 600,
  },
  status: {
    fontSize: 16,
    fontWeight: 400,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 600,
  },

  info: {
    borderTopWidth: 1,
    borderTopColor: "#e4e7eb",
    paddingTop: 12,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },

  actions: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  action: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#009689",
  },
  actionCancel: {
    backgroundColor: "#e7000b",
  },
});

export default styles;
