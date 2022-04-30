/*
Description: Login Screen
Purpose: 1. To render the UI
         2. Implement Login and Register Logic 
*/


import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Alert as moblieAlert, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Input, Text, Image, Avatar } from 'react-native-elements';
import { auth, db } from "../firebase";
import { assetsObject } from '../assets/asset';
export default function LoginScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registering, setRegistering] = useState(false);
  const [logining, setLogining] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        navigation.replace("Root")
      }
    })

    return unsubscribe
  }, [])

  const handleRegister = async () => {
    setRegistering(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        try {
          setDoc(doc(db, "Users", user.uid), {
            email: email,
          });
        } catch (e) {
          console.log(e)
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (checkIsWeb()) {
          setShowAlert(true);
          setAlertMsg('Register Unsuccess')
        } else {
          moblieAlert.alert(
            "Register Unsuccess",
            "Error: " + errorMessage,
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        }
      });
    setRegistering(false)
  }

  const handleLogin = () => {
    setLogining(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (checkIsWeb()) {
          setShowAlert(true);
          setAlertMsg('Login Unsuccess')
        } else {
          moblieAlert.alert(
            "Login Unsuccess",
            "Error: " + errorMessage,
            [
              { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
          );
        }
        console.log(email, password);
        console.log(errorMessage);
      });

    setLogining(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <Avatar
        size={100}
        rounded
        source={assetsObject['appIcon']}
        containerStyle={{ marginBottom: 0 }}
      />
      <View style={styles.inputcontainer}>
        <Input style={styles.input} placeholder='Email' onChangeText={text => setEmail(text)} />
        <Input style={styles.input} placeholder='Password' secureTextEntry onChangeText={text => setPassword(text)} />
      </View>
      <Button
        loading={logining}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: '#0a9396',
          borderRadius: 5,
        }}
        containerStyle={{
          marginHorizontal: 50,
          height: 50,
          width: 200,
          marginVertical: 10,
        }}
        onPress={handleLogin}
        title="Login"
      />
      <Button
        loading={registering}
        loadingProps={{ size: 'small', color: 'white' }}
        buttonStyle={{
          backgroundColor: '#0a9396',
          borderRadius: 5,
        }}
        containerStyle={{
          marginHorizontal: 50,
          height: 50,
          width: 200,
          marginVertical: 10,
        }}
        onPress={handleRegister}
        title="Register" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputcontainer: {

    width: '80%'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    fontSize: 12
  },
});

function checkIsWeb() {
  return (Platform.OS === 'ios' || Platform.OS === 'android') ? false : true;
}