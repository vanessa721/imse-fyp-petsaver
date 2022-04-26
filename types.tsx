/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Login: undefined;
  NotFound: undefined;
};

export type RootTabParamList = {
  HomeRoot: NavigatorScreenParams<HomeStackParamList> | undefined;
  SettingRoot: NavigatorScreenParams<SettingStackParamList> | undefined;
  FavouriteRoot: NavigatorScreenParams<MyFavParamList> | undefined;
  Inbox: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type SettingStackParamList = {
  Setting: undefined;
  ViewMyPost: undefined;
  PetRequestDetail: undefined;
  ViewMyAdpotedPet: undefined;
  CreateSocialMediaPost: undefined;
  CreatePost: undefined;
  UserSetting: undefined;

};

export type SettingStackProps<Screen extends keyof SettingStackParamList> = NativeStackScreenProps<
  SettingStackParamList,
  Screen
>;

export type MyFavParamList = {
  MyFav: undefined;
  PetSocialMedia: undefined;
};

export type MyFavStackProps<Screen extends keyof MyFavParamList> = NativeStackScreenProps<
  MyFavParamList,
  Screen
>;

export type HomeStackParamList = {
  Home: undefined;
  PostDetail: undefined;
};

export type HomeStackProps<Screen extends keyof HomeStackParamList> = NativeStackScreenProps<
  HomeStackParamList,
  Screen
>;

export interface petPostDataProps {
  id: string,
  imagepath: string,
  petname: string,
  petgender: string,
  petstages: string,
  desc: string,
  postcreator: string,
  requestUsers: string[],

}

export interface socialMediaDataProps {
  id: string,
  imagepath: string,
  caption: string,
  createdate: string,
}

export declare type ImageInfo = {
  uri: string;
  width: number;
  height: number;
  type?: 'image' | 'video';
  exif?: {
    [key: string]: any;
  };
  base64?: string;
};