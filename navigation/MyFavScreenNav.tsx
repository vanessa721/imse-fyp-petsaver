/*
Description: Fav Screen Stack Navigator
Purpose: 1. To implement Stack.Navigator
*/

import { FontAwesome } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet } from 'react-native';
import MyFavScreen from '../screens/MyFavScreen';
import PetSocialMediaScreen from '../screens/PetSocialMediaScreen';
import { MyFavParamList, MyFavStackProps } from '../types';


const Stack = createNativeStackNavigator<MyFavParamList>();

export default function MyFavScreenNav({ navigation }: MyFavStackProps<'MyFav'>) {

  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="MyFav" component={MyFavScreen}
      ></Stack.Screen>
      <Stack.Screen name="PetSocialMedia" component={PetSocialMediaScreen}
        options={{
          title: 'Pet Social Media',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('MyFav')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 20
              })}>
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
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
