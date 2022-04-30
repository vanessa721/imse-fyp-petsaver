/*
Description: This is the first page of the apps
Purpose: 1. To Show AppIntroSlider when user first time launch the apps 
         2. Render the Main Apps
*/
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

import React, { useState } from 'react';
import { Platform, StyleSheet, View, Text, Image, LogBox, ScrollView } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import LoginScreen from './screens/LoginScreen';
import RootScreen from './screens/RootScreen';
import { agreementTxt } from './assets/asset';

LogBox.ignoreLogs(['']);

const Stack = createNativeStackNavigator();

function checkIsWeb() {
  return (Platform.OS === 'ios' || Platform.OS === 'android') ? false : true;
}


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [showRealApp, setShowRealApp] = useState(() => checkIsWeb());

  const onDone = () => {
    setShowRealApp(true);
  };

  const onSkip = () => {
    setShowRealApp(true);
  };

  const RenderSliderItem = ({ item }: { item: any }) => {
    return (
      <>
        {item.key != 4 ?
          <View
            style={{
              flex: 1,
              backgroundColor: item.backgroundColor,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Image style={{ height: '100%', width: '100%', resizeMode: 'stretch' }} source={item.image} />
          </View> :
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'space-around',
              padding: 20,
              paddingTop: 60,
              paddingBottom: 100,
            }}>
            <Text style={{
              fontWeight: 'bold', fontSize: 22,
              textDecorationColor: '#0a9396', textDecorationLine: 'underline'
            }}>Privacy Policy and Personal Information Collection Statement </Text>
            <ScrollView>
              <Text> {agreementTxt}</Text>
            </ScrollView>

          </View>
        }
      </>


    );
  };

  if (!isLoadingComplete) {
    return null;
  }
  return (
    <>
      {showRealApp ? (
        <SafeAreaProvider>
          <StatusBar />
          <NavigationContainer
            linking={LinkingConfiguration}>
            <Stack.Navigator>
              <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen}></Stack.Screen>
              <Stack.Screen options={{ headerShown: false }} name="Root" component={RootScreen}></Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>

        </SafeAreaProvider>
      ) : (
        <AppIntroSlider
          data={slides}
          renderItem={RenderSliderItem}
          onDone={onDone}
          onSkip={onSkip}
        />
      )}
    </>
  );

}

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    image: require('./assets/intro_screen/firstpage.png'),
    backgroundColor: 'white',
  },
  {
    key: 4,
    title: 'Privacy Policy and Personal Information Collection Statement',
  }
];

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
