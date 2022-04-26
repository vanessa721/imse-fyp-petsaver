import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PetRequestStatusFlatList } from '../components/PetRequestStatusFlatList';
import { SettingStackProps } from '../types';



export default function ViewMyPostScreen({ navigation }: SettingStackProps<'ViewMyPost'>) {

  return (<>
    <View style={styles.container}>
      <PetRequestStatusFlatList navigation={navigation} />
    </View>
  </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: 'white',
    justifyContent: 'flex-start'

  },
});
