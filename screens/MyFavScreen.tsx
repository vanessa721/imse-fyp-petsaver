import { LinearGradient } from 'expo-linear-gradient';
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { default as React, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { AdoptedPetCard } from '../components/AdoptedPetCard';
import { auth, db } from "../firebase";
import { MyFavStackProps, petPostDataProps } from '../types';


export default function MyFavScreen({ navigation }: MyFavStackProps<'MyFav'>) {
  const [petPostDataArray, setpetPostDataArray] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    var userId = auth.currentUser?.uid;
    if (userId) {
      const unsub = onSnapshot(doc(db, "Users", userId), (doc) => {
        if (doc == undefined) return false;
        if (!doc.data()) return false;

        const temp_id_list = new Array()
        setpetPostDataArray([]);

        if (doc.data()?.favorites) {
          var q = query(collection(db, "PetPost"), where('__name__', "in", doc.data()?.favorites));
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const newjson = {
                id: doc.id,
                imagepath: doc.data()['imagepath'],
                petname: doc.data()['petname'],
                petgender: doc.data()['petgender'],
                petstages: doc.data()['petstages'],
                desc: doc.data()['desc'],
                postcreator: doc.data()['postcreator'],
                petType: doc.data()['petType'],
                requestUsers: [],
              }
              if (!temp_id_list.includes(doc.id)) {
                temp_id_list.push(doc.id)
                setpetPostDataArray((oldArray: any) => [...oldArray, newjson]);
              }
            });
          });
        }
        var q = query(collection(db, "PetPost"), where('adopterID', "==", userId));
        const unsubscribe2 = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const newjson = {
              id: doc.id,
              imagepath: doc.data()['imagepath'],
              petname: doc.data()['petname'],
              petgender: doc.data()['petgender'],
              petstages: doc.data()['petstages'],
              desc: doc.data()['desc'],
              postcreator: doc.data()['postcreator'],
              petType: doc.data()['petType'],
              requestUsers: [],
            }
            if (!temp_id_list.includes(doc.id)) {
              temp_id_list.push(doc.id);
              setpetPostDataArray((oldArray: any) => [...oldArray, newjson]);
            }
          });
        });
        var q = query(collection(db, "PetPost"), where('postcreator', "==", userId));
        const unsubscribe3 = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const newjson = {
              id: doc.id,
              imagepath: doc.data()['imagepath'],
              petname: doc.data()['petname'],
              petgender: doc.data()['petgender'],
              petstages: doc.data()['petstages'],
              desc: doc.data()['desc'],
              postcreator: doc.data()['postcreator'],
              petType: doc.data()['petType'],
              requestUsers: [],
            }
            if (!temp_id_list.includes(doc.id)) {
              temp_id_list.push(doc.id);
              setpetPostDataArray((oldArray: any) => [...oldArray, newjson]);
            }
          });
        });
      });
    }
  }

  useEffect(() => {
    getData()
    setIsLoading(false)
  }, []);
  return (<>
    <Text style={styles.header}>My Favourite</Text>
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
        renderItem={(item) => AdoptedPetCard(item, navigation)}
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
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#298e96',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: 'white',
    justifyContent: 'flex-start'
  },
  uppergadient: {
    flex: 1,
    //backgroundColor: 'white',
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

function checkInPetPostDataArray(array: any, newid: string) {
  for (var i = 0; i < array.length; i++) {
    console.log("array[i].id: ", array[i].id, ", newid: ", newid)
    if (array[i].id === newid) {
      return true;
    }
  }
  return false;

}