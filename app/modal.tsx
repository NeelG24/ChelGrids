import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>INFORMATION</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text style={styles.bodyText}>
        For testing sake, I have made the first row and column labels Connor and
        Leon, just to provide a freebie and demonstrate correct answer
        functionality - Zack Hyman is one of the many correct answers for the
        first cell in case you were wondering. Also, I have left the game on
        "easy mode", in that only players that have 10 or more registered
        seasons in the NHL will appear as row and column labels. Both the
        freebies and "easy mode" can be very simply altered in the code. The
        data begins at 2008. Swipe down to close.
      </Text>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3498db", // Your chosen color
    textShadowColor: "rgba(1.0, 0.5, 0.4, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  bodyText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#3498db", // Your chosen color
    lineHeight: 24,
    marginVertical: 10, // Adjust margin as needed
    textAlign: "center", // Adjust alignment as needed
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
});
