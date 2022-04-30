/*
Description: Home Screen
Purpose: 1. To render the UI of Home page
*/


import Constants from 'expo-constants';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SearchBar, Text } from 'react-native-elements';
import { petCatagoryData } from '../assets/asset';
import { PetCardFlatList } from '../components/PetCardFlatList';
import { PetCatagory } from '../components/PetCatagory';
import { HomeStackProps } from '../types';


export default function HomeScreen({ navigation }: HomeStackProps<'Home'>) {
  const [searchValue, setSearch] = useState<string>("");
  const [petTypeFilter, setPetFilter] = useState("");
  const updateSearch = (text: string) => {
    setSearch(text);
  };

  return (<>
    <View style={styles.container}>
      <View style={styles.headContainer}>
        <Text style={styles.header}>Good Morning</Text>
        <Text style={styles.headerDesc}>Are you ready to find a new friend</Text>
      </View>
      <View style={styles.SearchBarContainer}>
        {/* 
        // @ts-ignore */}
        <SearchBar
          placeholder="Search for pets"
          value={searchValue}
          platform="default"
          round={true}
          lightTheme={true}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle} />

      </View>
      <View style={styles.PetCatagoryContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          numColumns={5}
          data={petCatagoryData}
          renderItem={(item) => PetCatagory(item, petTypeFilter, setPetFilter)}
          keyExtractor={item => item.id}
        />
      </View>

      <Text style={styles.recent}>Recent</Text>

      <PetCardFlatList filter_column={''} filter_value={undefined}
        navigation={navigation} petTypeFilter={petTypeFilter} />


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
    marginTop: Constants.statusBarHeight
  },
  PetCatagoryContainer: {
  },
  inputContainerStyle: {
    backgroundColor: 'white',
    borderColor: '#dddddd',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: 30
  },
  containerStyle: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    height: 30

  },
  headContainer: {
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 15
  },
  SearchBarContainer: {
    paddingBottom: 15
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#298e96'
  },
  headerDesc: {
    fontSize: 15,
    color: '#aaaaaa'
  },
  recent: {
    fontWeight: 'bold',
    fontSize: 20
  },
  uppergadient: {
    flex: 1,
    backgroundColor: 'transparent',
    top: 0,
    width: '100%',
    height: 40,
    zIndex: 10
  },
  lowergadient: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40
  }
});
