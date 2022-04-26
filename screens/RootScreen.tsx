import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreenNav from '../navigation/HomeScreenNav';
import MyFavScreenNav from '../navigation/MyFavScreenNav';
import SettingScreenNav from '../navigation/SettingScreenNav';
import { RootTabParamList } from '../types';



export default function RootScreen({ navigation }: { navigation: any }) {
  const BottomTab = createBottomTabNavigator<RootTabParamList>();
  return (
    <BottomTab.Navigator
      initialRouteName="HomeRoot"
      screenOptions={{
        tabBarActiveTintColor: '#0b9298',
        tabBarShowLabel: false,
        tabBarStyle: { borderTopWidth: 0, backgroundColor: 'white', elevation: 0, height: '8%' }
      }}>
      <BottomTab.Screen
        name="HomeRoot"
        component={HomeScreenNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="home" color={color} size={25} />,
        }}
        listeners={{
          tabPress: (e) => {
            console.log('home click')
          },
        }}

      />
      <BottomTab.Screen
        name="FavouriteRoot"
        component={MyFavScreenNav}
        options={{

          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="heart" color={color} size={25} />,
        }}
        listeners={{
          tabPress: (e) => {
            console.log('Favourite click')
          },
        }}
      />
      <BottomTab.Screen
        name="SettingRoot"
        component={SettingScreenNav}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Feather name="user" color={color} size={25} />,
        }}
        listeners={{
          tabPress: (e) => {
            console.log('SettingRoot click')
          },
        }}
      />
    </BottomTab.Navigator>
  );
}