import React, { useState, useEffect } from "react";
import { Text, View, Switch, Animated } from "react-native";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";
import { useSelector, useDispatch } from "react-redux";
import { logOutAction } from "../redux/ducks/blogAuth";
import { changeMode, deletePic } from "../redux/ducks/accountPref";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.pref.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  const profilePicture = useSelector((state) => state.pref.profilePicture);
  const dispatch = useDispatch();

  const picSize = new Animated.Value(0);
  const sizeInterpolation = {
    inputRange: [0, 0.5, 1],
    outputRange: [200, 300, 200],
  };

  async function getUsername() {
    console.log("---- Getting user name ----");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignInSignUp");
        }
      } else {
        console.log(error);
      }
    }
  }

  function signOut() {
    dispatch({ ...logOutAction() });
    navigation.navigate("SignInSignUp");
  }

  function switchMode() {
    dispatch(changeMode());
  }

  function changePicSize() {
    Animated.loop(
      Animated.timing(picSize, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      })
    ).start();
  }

  function deletePhoto() {
    dispatch(deletePic());
    navigation.navigate("Camera");
  }

  useEffect(() => {
    //console.log("Setting up nav listener");
    const removeListener = navigation.addListener("focus", () => {
      //console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <FontAwesome
            name="sign-out"
            size={24}
            style={{ color: styles.headerTint, marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={[styles.title, { marginTop: 20 }]}>Hello {username} !</Text>
      <View
        style={{
          height: profilePicture == null ? 0 : 320,
          justifyContent: "center",
        }}
      >
        {profilePicture == null ? (
          <View />
        ) : (
          <TouchableWithoutFeedback onPress={changePicSize}>
            <Animated.Image
              style={{
                width: picSize.interpolate(sizeInterpolation),
                height: picSize.interpolate(sizeInterpolation),
                borderRadius: 200,
              }}
              source={{ uri: profilePicture?.uri }}
            />
          </TouchableWithoutFeedback>
        )}
      </View>
      <TouchableOpacity
        onPress={() =>
          profilePicture == null ? navigation.navigate("Camera") : deletePhoto()
        }
      >
        <Text
          style={{
            marginTop: 10,
            fontSize: 20,
            color: !isDark ? "#0000EE" : "#EEEE00",
          }}
        >
          {" "}
          {profilePicture == null
            ? "No profile picture. Click to take one."
            : "Retake the profile picture."}{" "}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 20,
        }}
      >
        <Text style={[styles.content, styles.text]}> Light Mode </Text>
        <Switch value={isDark} onChange={switchMode} />
        <Text style={[styles.content, styles.text]}> Dark Mode </Text>
      </View>
    </View>
  );
}

var customStyles5 = StyleSheet.create({
  track: {
    height: 18,
    borderRadius: 1,
    backgroundColor: "#d5d8e8",
  },
  thumb: {
    width: 20,
    height: 30,
    borderRadius: 1,
    backgroundColor: "#838486",
  },
});
