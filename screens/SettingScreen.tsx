import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-elements';
import { auth } from "../firebase";
import { SettingStackProps } from '../types';

export default function SettingsScreen({ navigation }: SettingStackProps<'Setting'>) {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        return navigation.getParent()?.navigate('Login');
      })
      .catch((error: { message: any; }) => alert(error.message))
  }
  const handleToCreatePost = () => {
    return navigation.navigate('CreatePost');
  }
  const handleToViewMyPost = () => {
    return navigation.navigate('ViewMyPost');
  }

  const handleToViewMyAdoptedPet = () => {
    return navigation.navigate('ViewMyAdpotedPet');
  }

  const handleToUserSetting = () => {
    return navigation.navigate('UserSetting');
  }



  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <Button
        loading={false}
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
        onPress={handleToUserSetting}
        title="Edit User Profile"
      />

      <Button
        loading={false}
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
        onPress={handleToCreatePost}
        title="Post Pet For Adoption"
      />
      <Button
        loading={false}
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
        onPress={handleToViewMyPost}
        title="View My Posts Requset"
      />
      <Button
        loading={false}
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
        onPress={handleToViewMyAdoptedPet}
        title="View My Adopted Pet"
      />
      <Button
        loading={false}
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
        onPress={handleSignOut}
        title="SignOut"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
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
