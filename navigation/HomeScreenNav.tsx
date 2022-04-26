import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import { HomeStackParamList, HomeStackProps } from '../types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeScreenNav({ navigation }: HomeStackProps<'Home'>) {

  return (
    <Stack.Navigator>

      <Stack.Screen options={{ headerShown: false }} name="Home" component={HomeScreen}
      ></Stack.Screen>
      <Stack.Screen name="PostDetail" component={PostDetailScreen}
        options={{
          headerShown: false
        }}
      ></Stack.Screen>




    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
