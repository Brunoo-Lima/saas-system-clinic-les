import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    width: 300,
    maxWidth: 300,
    backgroundColor: "#fafafa",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 8px",
    borderRadius: 12,
    padding: 20,
    elevation: 2,

    flexDirection: "column",
  },

  patient: {
    fontSize: 16,
    fontWeight: 400,
  },
  patientName: {
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
