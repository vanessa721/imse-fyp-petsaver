import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MyAdoptedPetCard } from '../components/MyAdoptedPetCard';
import { auth, db } from "../firebase";
import { petPostDataProps, SettingStackProps } from '../types';

export default function ViewMyPostScreen({ navigation }: SettingStackProps<'ViewMyAdpotedPet'>) {
  const [petPostDataArray, setpetPostDataArray] = useState<petPostDataProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    var q = query(collection(db, "PetPost"), where("adopterID", "==", auth.currentUser?.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setpetPostDataArray([])

      querySnapshot.forEach(async (docSnap) => {

        const newjson = {
          id: docSnap.id,
          imagepath: docSnap.data()['imagepath'],
          petname: docSnap.data()['petname'],
          petgender: docSnap.data()['petgender'],
          petstages: docSnap.data()['petstages'],
          desc: docSnap.data()['desc'],
          postcreator: docSnap.data()['postcreator'],
          requestUsers: [],
          adopterID: docSnap.data()['adopterID'],
        }
        //console.log(doc.data()['createdate'], newjson);
        setpetPostDataArray(oldArray => [...oldArray, newjson]);
      });
    });

  }

  useEffect(() => {
    getData()
    setIsLoading(false)
  }, []);
  return (<>
    <View style={styles.container}>

      <View style={styles.uppergadient}>
        <LinearGradient
          colors={['white', 'rgba(255,255,255,0)']}
          style={{ height: 40 }}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={true}
        showsHorizontalScrollIndicator={false}
        data={petPostDataArray}
        renderItem={(item) => MyAdoptedPetCard(item, navigation)}
        keyExtractor={item => item.id}
      />
      <View style={styles.lowergadient}>
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
          style={{ height: 40 }}
        />
      </View>
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
  uppergadient: {
    flex: 1,
    top: 20,
    width: '100%',
    height: 40,
    zIndex: 10,
    position: 'absolute'
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
