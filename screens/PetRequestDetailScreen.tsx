/*
Description: Pet Request Detail Screen
Purpose: 1. To render the UI
         2. Implement approve request function 
*/

import { deleteField, doc, onSnapshot, updateDoc, collection, deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, ListItem, Text } from 'react-native-elements';
import { db } from "../firebase";


export default function PetRequestDetailScreen({ route, navigation }: { route: any, navigation: any }) {
  const [ownerName, setOwnerName] = useState<string | undefined>('');
  const [ownerImagepath, setOwnerImage] = useState("");
  const [requestUserList, setRequstUserList] = useState<any>([])
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<any>([]);
  const [petPostDataItem, setPetPostDataItem] = useState(route.params.petPostDataItem)

  const getRequestDetail = async (requestID: string) => {

    if (!requestID) return false;

    const unsub = onSnapshot(doc(db, "Users", requestID), (doc) => {
      if (doc == undefined) return false;
      if (!doc.data()) return false;

      const newjson = {
        userId: doc.id,
        userName: doc.data()?.username,
        userIconUri: doc.data()?.userIconUri,
        userDesc: doc.data()?.desc,
        userEmail: doc.data()?.email,
        userAge: doc.data()?.userAge,
        addressDocUri: doc.data()?.addressDocUri,
        incomeDocUri: doc.data()?.incomeDocUri,
        totalIncome: doc.data()?.totalIncome,
        apartmentType: doc.data()?.apartmentType,
        apartmentSize: doc.data()?.apartmentSize,
        hvExperience: doc.data()?.hvExperience,
        hvWindowScreen: doc.data()?.hvWindowScreen,
        numOfOtherPet: doc.data()?.numOfOtherPet,
        otherPetDescription: doc.data()?.otherPetDescription,
        hvSmoker: doc.data()?.hvSmoker,
        hvAllergySymptoms: doc.data()?.hvAllergySymptoms,
        hvRespiratoryDiseases: doc.data()?.hvRespiratoryDiseases,
      }
      setRequstUserList((oldArray: any) => [...oldArray, newjson]);
    });
  }

  const removePetAdopter = async (swipeableIndex: number) => {
    var requestUserID = requestUserList[swipeableIndex].userId
    try {
      if (!requestUserID || !petPostDataItem.id) {
        console.error("requestUserID or petPostDataItem.id not found:  ", requestUserID, petPostDataItem.id);
        return false;
      }
      if (requestUserID == petPostDataItem.adopterID) {
        const petPostRef = doc(db, 'PetPost', petPostDataItem.id);
        await updateDoc(petPostRef, {
          adopterID: deleteField()
        });
        setPetPostDataItem({ ...petPostDataItem, adopterID: '' })
        console.log("adopterID deleteField for post: ", petPostRef.id);
      }

      var requestRef = doc(db,
        "PetPost/" + petPostDataItem.id + '/contactRequest/', requestUserID);
      deleteDoc(requestRef);

      var tempList = requestUserList;
      tempList.splice(swipeableIndex, 1);
      setRequstUserList(tempList);
      console.error("tempList:  ", tempList);


    } catch (e) {
      console.error("Error adding document:  ", e);
    }
  }

  const setPetAdopter = async (swipeableIndex: number) => {
    var requestUserID = requestUserList[swipeableIndex].userId
    try {
      if (!requestUserID || !petPostDataItem.id) {
        console.error("requestUserID or petPostDataItem.id not found:  ", requestUserID, petPostDataItem.id);
        return false;
      }

      if (requestUserID == petPostDataItem.postcreator) {
        console.log('You cannot set petowner to adopter')
        Alert.alert(
          "Request Failed", "You cannot set petowner to adopter",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
        return false;
      }

      const petPostRef = doc(db, 'PetPost', petPostDataItem.id);
      await updateDoc(petPostRef, {
        adopterID: requestUserID
      });
      setPetPostDataItem({ ...petPostDataItem, adopterID: requestUserID })
      console.log("adopterID written as ID: ", requestUserID);

    } catch (e) {
      console.error("Error adding document:   ", e);
    }
  }

  const getAdoptorID = async () => {
  }

  useEffect(() => {
    console.log("route.params.petPostDataItem.item", route.params)
    setRequstUserList([])
    if (petPostDataItem.requestUsers) {
      petPostDataItem.requestUsers.forEach((requestID: string, index: any) => {
        getRequestDetail(requestID);
      })
    }
  }, [route]);

  return (
    <>
      <View style={styles.container}>
        <Text></Text>
        <ScrollView showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ height: "100%", width: "100%" }} >
          {
            requestUserList.map((l: any, i: number) => (
              <ListItem.Swipeable key={i} bottomDivider
                containerStyle={{
                  backgroundColor: (requestUserList[i].userId == petPostDataItem.adopterID
                  ) ? '#CBFFC0' : petPostDataItem.adopterID ? 'white' : 'white', marginRight: 5
                }}
                leftContent={
                  <Button
                    title="Reject"
                    icon={{ name: 'close', color: 'white' }}
                    buttonStyle={{ height: '100%', backgroundColor: 'red' }}
                    onPress={() => {
                      console.log('removePetAdopter', i)
                      removePetAdopter(i)
                    }
                    }
                  />
                }
                leftStyle={{ height: '100%', backgroundColor: 'red', justifyContent: 'center' }}
                rightContent={
                  <Button
                    title="Accpet"
                    icon={{ name: 'check', color: 'white' }}

                    buttonStyle={{ minHeight: '100%', backgroundColor: 'green' }}
                    onPress={() => {
                      console.log('setPetAdopter ', i)
                      setPetAdopter(i)
                    }
                    }
                  />
                }
                rightStyle={{ height: '100%', backgroundColor: 'green', justifyContent: 'center' }}

              >
                {(l.userIconUri != "" && l.userIconUri != undefined) ?
                  <Avatar
                    size={50}
                    rounded
                    source={{ uri: l.userIconUri }}
                  /> : <Avatar
                    size={50}
                    rounded
                    title={l.userName ? l.userName[0] : ""}
                    containerStyle={{ backgroundColor: '#aaaaaa' }}
                  />
                }
                <ListItem.Content style={{}}>
                  <ListItem.Title>{l.userEmail} </ListItem.Title>
                  <ListItem.Subtitle>User Name: {l.userName} </ListItem.Subtitle>
                  <ListItem.Subtitle>user Description: {l.userDesc}</ListItem.Subtitle>
                  <ListItem.Subtitle>User Age: {l.userAge}</ListItem.Subtitle>
                  <ListItem.Subtitle>Address Prove: {l.addressDocUri ? <Text style={{ color: 'lightblue' }}
                    onPress={() => Linking.openURL(l.addressDocUri)}>
                    Documnet Link
                  </Text> : 'None'}</ListItem.Subtitle>
                  <ListItem.Subtitle>Income Prove: {l.incomeDocUri ? <Text style={{ color: 'lightblue' }}
                    onPress={() => Linking.openURL(l.incomeDocUri)}>
                    Documnet Link
                  </Text> : 'None'}</ListItem.Subtitle>
                  <ListItem.Subtitle>Family Income: {l.totalIncome}</ListItem.Subtitle>
                  <ListItem.Subtitle>Apartment Type: {l.apartmentType}</ListItem.Subtitle>
                  <ListItem.Subtitle>Apartment Size: {l.apartmentSize}</ListItem.Subtitle>
                  <ListItem.Subtitle>Have Pet Experience: {l.hvExperience}</ListItem.Subtitle>
                  <ListItem.Subtitle>Have Window Screen: {l.hvWindowScreen}</ListItem.Subtitle>
                  <ListItem.Subtitle>Number Of Other Pet: {l.numOfOtherPet}</ListItem.Subtitle>
                  <ListItem.Subtitle>Other Pet Description: {l.otherPetDescription}</ListItem.Subtitle>
                  <ListItem.Subtitle>No Smoker in family: {l.hvSmoker}</ListItem.Subtitle>
                  <ListItem.Subtitle>No Member have Allergy Symptoms: {l.hvAllergySymptoms}</ListItem.Subtitle>
                  <ListItem.Subtitle>No Member have Respirator Diseases: {l.hvRespiratoryDiseases}</ListItem.Subtitle>
                </ListItem.Content>
                {/*
              // @ts-ignore */}
                <ListItem.Chevron color="green" />
              </ListItem.Swipeable>
            ))
          }
        </ScrollView>
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    backgroundColor: 'white',
    height: "100%"
  },
  iconContainer: {
    padding: 20,
    alignSelf: 'flex-start',
    zIndex: 1,
    position: 'absolute'
  },
  iconContainer2: {
    padding: 20,
    alignSelf: 'flex-end',
    zIndex: 1,
    position: 'absolute'
  },
  imageitem: {
    zIndex: 0,
    aspectRatio: 1.1,
    width: '100%',
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
  petname: {
    fontWeight: 'bold',
    fontSize: 30
  },
  petgender: {
    fontSize: 10, marginBottom: 12, fontWeight: 'bold', color: '#888888'
  },
  desc: {
    fontSize: 10, color: '#999999'
  },
  contactbutton: {
    backgroundColor: '#0b9298',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginRight: 30
  },
  contactbuttonContainer: {
    marginHorizontal: 30
  },
  footerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
    width: '100%',
    height: '10%',
  },
  ownerContainer: {
    marginLeft: 30,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  ownerDetailContainer: {
    marginLeft: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },


});

const blankIconUrl = 'https://firebasestorage.googleapis.com/v0/b/petsaver-1fa7d.appspot.com/o/userIcon%adaptive-icon.png?alt=media&token=https://firebasestorage.googleapis.com/v0/b/petsaver-1fa7d.appspot.com/o/userIcon%2Fadaptive-icon.png?alt=media&token=46b9f84d-6f72-4020-8e8d-e6155fa95896'