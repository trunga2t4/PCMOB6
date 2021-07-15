import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import axios from "axios";
import { API, API_CREATE } from "../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightStyles, commonStyles } from "../styles/commonStyles";

export default function CreateScreen({ navigation }) {

  const styles = {...lightStyles, ...commonStyles}


  return (
    <View style={styles.container}>
      <Text>
        Create Post Screen
      </Text>
    </View>
  )
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    marginLeft: 5
  }
});