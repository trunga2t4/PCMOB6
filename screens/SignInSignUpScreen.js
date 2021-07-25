import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { TouchableOpacity, UIManager, LayoutAnimation } from "react-native";
import { ActivityIndicator, Keyboard } from "react-native";
import { API, API_LOGIN, API_SIGNUP } from "../constants/API";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logInAction } from "../redux/ducks/blogAuth";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation }) {
  const [username, setUsername] = useState("U2");
  const [password, setPassword] = useState("P2");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [errorText, setErrorText] = useState("");
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.pref.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  async function login() {
    console.log("---- Login time ----");
    Keyboard.dismiss();
    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success logging in!");
      dispatch({ ...logInAction(), payload: response.data.access_token });
      setLoading(false);
      setUsername("");
      setPassword("");
      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      console.log("Error logging in!");
      console.log(error);
      setErrorText(error.response.data.description);
      if ((error.response.status = 404)) {
        setErrorText("User does not exist");
      }
    }
  }

  async function signup() {
    console.log("---- Sign Up time ----");
    Keyboard.dismiss();
    if (password == password2) {
      try {
        setLoading(true);
        const response = await axios.post(API + API_SIGNUP, {
          username,
          password,
        });
        console.log("Success signing up!");
        console.log(response);
        if (response.data.Error) {
          setErrorText(response.data.Error);
          setLoading(false);
        } else {
          console.log("Signed up!");
          setLoading(false);
          login();
          setIsLogIn(true);
        }
      } catch (error) {
        setLoading(false);
        console.log("Error signing up!");
        console.log(error);
        setErrorText(error.response.data.description);
      }
    } else {
      setErrorText("Password mismatch");
    }
  }

  return (
    <View style={styles.container2}>
      <Text style={[styles.title, { margin: 20 }]}>
        {isLogIn ? "Log In" : "Sign Up"}
      </Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username:"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password:"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={(pw) => setPassword(pw)}
        />
      </View>
      {isLogIn ? (
        <View />
      ) : (
        <View style={styles.inputView}>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm Password:"
            placeholderTextColor="#003f5c"
            secureTextEntry={true}
            value={password2}
            onChangeText={(pw) => setPassword2(pw)}
          />
        </View>
      )}
      <View />
      <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={isLogIn ? login : signup}
          >
            <Text style={styles.buttonText}>
              {" "}
              {isLogIn ? "Log In" : "Sign Up"}{" "}
            </Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ marginLeft: 10 }} />
          ) : (
            <View />
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: "linear", property: "opacity" },
            update: { type: "spring", springDamping: 0.4 },
          });
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}
      >
        <Text style={[styles.text, { margin: 20, fontSize: 20 }]}>
          {" "}
          {isLogIn ? "To Sign Up page" : "To Sign In page"}{" "}
        </Text>
      </TouchableOpacity>
      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
}
