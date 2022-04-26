/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { RootStackParamList } from '../types';


const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          HomeRoot: {
            screens: {
              Home: {
                screens: {
                  HomeScreen: 'HomeScreen',
                },
              },
              PostDetail: {
                screens: {
                  PostDetailScreen: 'PostDetailScreen',
                },
              },
            },
          },
          FavouriteRoot: {
            screens: {
              MyFav: {
                screens: {
                  MyFavScreen: 'MyFavScreen',
                },
              },
              PetSocialMedia: {
                screens: {
                  PetSocialMediaScreen: 'PetSocialMediaScreen',
                },
              },
            },
          },
          Inbox: {
            screens: {
              InboxScreen: 'InboxScreen',
            },
          },
          SettingRoot: {
            screens: {
              Setting: {
                screens: {
                  SettingScreen: 'SettingScreen',
                },
              },
              ViewMyPost: {
                screens: {
                  ViewMyPostScreen: 'ViewMyPostScreen',
                },
              },
              ViewMyAdpotedPet: {
                screens: {
                  ViewMyAdpotedPetScreen: 'ViewMyAdpotedPetScreen',
                },
              },
              PetRequestDetail: {
                screens: {
                  PetRequestDetailScreen: 'PetRequestDetailScreen',
                },
              },
              CreatePost: {
                screens: {
                  CreatePostScreen: 'CreatePostScreen',
                },
              },
              UserSetting: {
                screens: {
                  UserSettingScreen: 'UserSettingScreen',
                },
              },
            },
          },
        },
      },
      Login: 'login',
      NotFound: '*',
    },
  },
};

export default linking;
