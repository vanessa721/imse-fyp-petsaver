import { LinearGradient } from 'expo-linear-gradient';
import { collection, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TouchableHighlight, View } from 'react-native';
import { Avatar, Dialog, Text } from 'react-native-elements';
import { db } from "../firebase";
import { socialMediaDataProps } from '../types';

export default function PetSocialMediaScreen({ route, navigation }: { route: any, navigation: any }) {
  const [ownerName, setOwnerName] = useState<string | undefined>('');
  const [ownerImagepath, setOwnerImage] = useState("");

  const [showImageDialog, setShowImageDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null);


  const [petPostDataItem, setPetPostDataItem] = useState(route.params.petPostDataItem)
  const [socialMediaDataArray, setSocialMediaDataArray] = useState<socialMediaDataProps[]>([]);

  const getOwnerDetail = async () => {
    if (!petPostDataItem.postcreator) return false;

    const unsub = onSnapshot(doc(db, "Users", petPostDataItem.postcreator), (doc) => {
      if (doc == undefined) return false;
      if (!doc.data()) return false;
      setOwnerName(doc.data()?.username)
      setOwnerImage(doc.data()?.userIconUri)
    });
  }

  const getData = async () => {

    var socialMediaPostRef = collection(db, "PetPost/" + petPostDataItem.id + '/socialMediaPost');

    const q = query(socialMediaPostRef, orderBy('createdate', 'desc'));
    setSocialMediaDataArray([])
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnap) => {
      const newjson = {
        id: docSnap.id,
        imagepath: docSnap.data()['imagepath'],
        caption: docSnap.data()['caption'],
        createdate: docSnap.data()['createdate'],
      }
      console.log("newjson: ", newjson)
      setSocialMediaDataArray(oldArray => [...oldArray, newjson]);
    });

  }

  useEffect(() => {
    getData()
    getOwnerDetail();
  }, []);

  const renderItem = (petPostDataItem: any) => {
    return (

      <View style={styles.CardContainer}>
        {
          petPostDataItem.item.imagepath != "" &&
          <View>
            <TouchableHighlight
              onPress={() => {
                console.log('item:', petPostDataItem)
                setSelectedId(petPostDataItem.index);
              }}
              underlayColor="white">

              <Image style={styles.imageitem}
                source={{ uri: petPostDataItem.item.imagepath }}
              />
            </TouchableHighlight >


            <Dialog isVisible={petPostDataItem.index === selectedId}
              onBackdropPress={() => {

                setSelectedId(null);
              }}>
              <Image style={styles.imageitem}
                source={{ uri: petPostDataItem.item.imagepath }}
              />
              <Text>{petPostDataItem.item.caption}</Text>
              <Text>{timestampToDate(petPostDataItem.item.createdate.seconds)}</Text>
            </Dialog>
          </View>

        }
      </View >
    );
  };


  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {(petPostDataItem.imagepath != "" && petPostDataItem.imagepath != undefined) ?

            <Avatar
              size={100}
              rounded
              source={{ uri: petPostDataItem.imagepath }}
            />
            : <Avatar
              size={100}
              rounded
              title={petPostDataItem.petname ? petPostDataItem.petname[0] : ""}
              containerStyle={{ backgroundColor: '#aaaaaa' }}
            />
          }
          <View style={styles.iconDescriptionContainer}>
            <Text style={styles.petname}>{petPostDataItem.petname}</Text>
            <Text style={styles.petgender}>{petPostDataItem.petgender}  -  {petPostDataItem.petstages} </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={{ fontSize: 14, marginTop: 12, fontWeight: 'bold' }}>Recent Post</Text>
          <View style={styles.uppergadient}>
            <LinearGradient
              colors={['white', 'rgba(255,255,255,0)']}
              style={{ height: 40 }}
            />
          </View>
          <View
            style={styles.flexContainer}>
            <FlatList
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={false}
              data={socialMediaDataArray}
              renderItem={(item) => renderItem(item)}
              keyExtractor={item => item.id}
              numColumns={3}
              extraData={selectedId}

            />
          </View>
          <View style={styles.lowergadient}>
            <LinearGradient
              colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
              style={{ height: 40 }}
            />
          </View>
        </View>

      </View >
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: "100%",
    flexDirection: 'column'
  },
  iconContainer: {
    padding: 20,
    alignSelf: 'flex-start',
    zIndex: 1,
    flexDirection: 'row'
  },
  iconDescriptionContainer: {
    marginLeft: 20,
    alignSelf: 'flex-start'
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  contentContainer: {
    width: '100%',
    height: '100%',
    padding: 30,

    flex: 1,
    borderRadius: 25,
    backgroundColor: 'white',
    top: -30
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
  },
  petname: {
    fontWeight: 'bold',
    fontSize: 20
  },
  petgender: {
    fontSize: 10, marginBottom: 12, fontWeight: 'bold', color: '#888888'
  },
  CardContainer: {
    width: '33%',
    borderColor: '#fefefe',
    borderWidth: 1
  },
  imageitem: {
    aspectRatio: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },


});

function timestampToDate(t: number) {
  var date = new Date(t * 1000);

  var hours = date.getHours();

  var minutes = "0" + date.getMinutes();

  var seconds = "0" + date.getSeconds();

  var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

  return formattedTime;

}


