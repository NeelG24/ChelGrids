import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import axios from "axios";

const registrationScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:3306/register", {
        username,
        email,
        password,
      });
      console.log("Registration successful:", response.data.message);
      // Optionally, navigate to another screen or display a success message.
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration failure, e.g., display an error message.
    }
  };
  // useEffect(() => {
  //   const authenticate = async () => {
  //     axios.post();
  //   };
  //   //authenticate();
  // }, []);

  const usernameHandler = (text) => {
    setUsername(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        style={styles.bodyText}
        placeholderTextColor="#3498db"
        onChangeText={usernameHandler}
      />
      <TextInput
        placeholder="Email"
        style={styles.bodyText}
        autoCapitalize="none"
        placeholderTextColor="#3498db"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        style={styles.bodyText}
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="#3498db"
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          color="#fff"
          onPress={() => setIsSubmit(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyText: {
    fontSize: 18,
    fontWeight: "normal",
    color: "#3498db", // Your chosen color
    paddingVertical: 10, // Adjust margin as needed
    borderBottomColor: "#fff",
    borderBottomWidth: 1,
    width: "60%",
  },
  buttonContainer: {
    //position: "absolute",
    backgroundColor: "#3489db", // Choose a color for the reset button
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginTop: 40,
  },
});

export default registrationScreen;
