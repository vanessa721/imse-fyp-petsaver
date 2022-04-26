import { FontAwesome } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, StyleSheet } from 'react-native';
import CreatePostScreen from '../screens/CreatePostScreen';
import CreateSocialMediaPostScreen from '../screens/CreateSocialMediaPostScreen';
import PetRequestDetailScreen from '../screens/PetRequestDetailScreen';
import SettingScreen from '../screens/SettingScreen';
import UserSettingScreen from '../screens/UserSettingScreen';
import ViewMyAdoptedPetScreen from '../screens/ViewMyAdoptedPetScreen';
import ViewMyPostScreen from '../screens/ViewMyPostScreen';
import { SettingStackParamList, SettingStackProps } from '../types';

const Stack = createNativeStackNavigator<SettingStackParamList>();

export default function SettingsScreen({ navigation }: SettingStackProps<'Setting'>) {
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="Setting" component={SettingScreen}
      ></Stack.Screen>
      <Stack.Screen name="UserSetting" component={UserSettingScreen}
        options={{
          title: 'UserSetting',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('Setting')}
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
      <Stack.Screen name="CreatePost" component={CreatePostScreen}
        options={{
          title: 'Create Pet Adoption Post',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('Setting')}
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
      <Stack.Screen name="ViewMyPost" component={ViewMyPostScreen}
        options={{
          title: 'View all my pet posts',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('Setting')}
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
      <Stack.Screen name="PetRequestDetail" component={PetRequestDetailScreen}
        options={{
          title: 'View all Request',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('ViewMyPost')}
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
      <Stack.Screen name="ViewMyAdpotedPet" component={ViewMyAdoptedPetScreen}
        options={{
          title: 'View My Adpoted Pet',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('Setting')}
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
      <Stack.Screen name="CreateSocialMediaPost" component={CreateSocialMediaPostScreen}
        options={{
          title: 'Create Social Media Post',
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.replace('ViewMyAdpotedPet')}
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
