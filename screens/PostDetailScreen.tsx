
import { FontAwesome } from '@expo/vector-icons';
import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Text } from 'react-native-elements';
import { auth, db } from "../firebase";


export default function PostDetailScreen({ route, navigation }: { route: any, navigation: any }) {
  const { petItem } = route.params;
  const [ownerName, setOwnerName] = useState<string | undefined>('');
  const [ownerImagepath, setOwnerImage] = useState("");

  const [isfav, setIsFav] = useState(false)
  const [addressDocUri, setAddressDocUri] = useState('');
  const [incomeDocUri, setIncomeDocUri] = useState('');
  const [totalIncome, setTotalIncome] = useState('');
  const [apartmentType, setApartmentType] = useState('');
  const [apartmentSize, setApartmentSize] = useState('');
  const [hvExperience, setHvExperience] = useState('');
  const [hvWindowScreen, setHvWindowScreen] = useState('');
  const [numOfOtherPet, setNumOfOtherPet] = useState('');
  const [otherPetDescription, setOtherPetDescription] = useState('');
  const [hvSmoker, setHvSmoker] = useState('');
  const [hvRespiratoryDiseases, setHvRespiratoryDiseases] = useState('');
  const [hvAllergySymptoms, setHvAllergySymptoms] = useState('');

  const getOwnerDetail = async () => {
    if (!petItem.postcreator) return false;

    const unsub = onSnapshot(doc(db, "Users", petItem.postcreator), (doc) => {
      if (doc == undefined) return false;
      if (!doc.data()) return false;
      setOwnerName(doc.data()?.username)
      setOwnerImage(doc.data()?.userIconUri)
    });
  }

  const getCurrentUserDetail = async () => {
    var userId = auth.currentUser?.uid;
    if (userId) {
      const unsub = onSnapshot(doc(db, "Users", userId), (doc) => {
        if (doc == undefined) return false;
        if (!doc.data()) return false;
        setAddressDocUri(doc.data()?.addressDocUri);
        setIncomeDocUri(doc.data()?.incomeDocUri);
        setTotalIncome(doc.data()?.totalIncome);
        setApartmentType(doc.data()?.apartmentType);
        setApartmentSize(doc.data()?.apartmentSize);
        setHvExperience(doc.data()?.hvExperience);
        setHvWindowScreen(doc.data()?.hvWindowScreen);
        setNumOfOtherPet(doc.data()?.numOfOtherPet);
        setOtherPetDescription(doc.data()?.otherPetDescription);
        setHvSmoker(doc.data()?.hvSmoker);
        setHvAllergySymptoms(doc.data()?.hvAllergySymptoms);
        setHvRespiratoryDiseases(doc.data()?.hvRespiratoryDiseases);

        if (doc.data()?.favorites) {
          console.log('doc.data()?.favorites', doc.data()?.favorites)
          console.log('petItem.id', petItem.id)
          console.log('(doc.data()?.favorites).indexOf(petItem.id) >= 0', (doc.data()?.favorites).indexOf(petItem.id) >= 0)
          if ((doc.data()?.favorites).indexOf(petItem.id) >= 0) {
            setIsFav(true);
          } else {
            setIsFav(false);
          }
        }
      });
    }

  }

  const checkFulfillRequirement = () => {
    if (
      !(petItem.hvAddressProve == 'true' && (addressDocUri == '' || addressDocUri == undefined)) &&
      !(petItem.hvIncomeProve == 'true' && (incomeDocUri == '' || incomeDocUri == undefined)) &&
      !(petItem.totalIncome && (totalIncome < petItem.totalIncome || totalIncome == undefined || totalIncome == '')) &&
      !(petItem.apartmentType == 'non_public_housing' && apartmentType != petItem.apartmentType) &&
      !(petItem.apartmentSize && (apartmentSize < petItem.apartmentSize || apartmentSize == undefined || apartmentSize == '')) &&
      !(petItem.hvExperience == 'true' && hvExperience != petItem.hvExperience) &&
      !((petItem.hvWindowScreen == 'true' && hvWindowScreen != petItem.hvWindowScreen)) &&
      !(petItem.hvSmoker == 'true' && hvSmoker != petItem.hvSmoker) &&
      !(petItem.hvAllergySymptoms == 'true' && hvAllergySymptoms != petItem.hvAllergySymptoms) &&
      !(petItem.hvRespiratoryDiseases == 'true' && hvRespiratoryDiseases != petItem.hvRespiratoryDiseases)
    ) {
      console.log("checkFulfillRequirement: true")
      return true
    }
    else {
      console.log("checkFulfillRequirement: false")
      return false
    }
  }

  const sendContactRequest = async () => {
    var userId = auth.currentUser?.uid;

    if (petItem.postcreator == userId) {
      Alert.alert(
        "Request Failed", "You cannot adopt your own pet",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return false;
    }
    if (!checkFulfillRequirement()) {
      console.log("!checkFulfillRequirement()")
      Alert.alert(
        "Request Failed", "Some requirements not fulfill, Please update User Profile",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      return false;
    }

    try {
      if (!userId) {
        console.error("userId not found:  ", auth.currentUser);
        return false;
      }

      var postRef = doc(db, "PetPost", petItem.id);
      var requestRef = doc(postRef, "contactRequest", userId);

      const unsub = await setDoc(requestRef, {
        status: 'New request',
        requestTime: new Date(),
      }, { merge: true });

      console.log("Document written with ID: ", petItem.id);
      Alert.alert(
        "Request Sent", "Please wait for pet owner to contact you through email",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
    } catch (e) {
      console.error("Error adding document:  ", e);
    }

  }

  const setFav = async () => {
    var userId = auth.currentUser?.uid;
    try {
      if (userId) {
        const UserRef = doc(db, 'Users', userId);
        if (isfav) {
          await updateDoc(UserRef, {
            favorites: arrayRemove(petItem.id)
          });
          console.log("remove ToFav Done");
          setIsFav(false)
        } else {

          await updateDoc(UserRef, {
            favorites: arrayUnion(petItem.id)
          });
          console.log("add To Fav Done");
          setIsFav(true)

        }

      } else {
        console.error("userId not found:  ", auth.currentUser);
      }
    } catch (e) {
      console.error("Error adding document:  ", e);
    }
  }

  useEffect(() => {
    getCurrentUserDetail();
    getOwnerDetail();
    navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
    return () => navigation.getParent()?.setOptions(
      { tabBarStyle: { borderTopWidth: 0, backgroundColor: 'white', elevation: 0, height: '8%' } });
  }, [navigation]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <FontAwesome
            name="arrow-left"
            size={25}
            color="white"
            onPress={() => { navigation.navigate('Home') }}
          />
        </View>
        <View style={styles.iconContainer2}>
          {isfav ?
            <FontAwesome
              name="heart"
              size={25}
              color="white"
              onPress={() => {
                setFav()
              }}
            /> : <FontAwesome
              name="heart-o"
              size={25}
              color="white"
              onPress={() => {
                setFav()
              }}
            />}
        </View>


        {petItem.imagepath != "" && <Image style={styles.imageitem}
          source={{ uri: petItem.imagepath }}
        />}
        <View style={styles.contentContainer}>
          <Text style={styles.petname}>{petItem.petname}</Text>
          <Text style={styles.petgender}>{petItem.petgender}  -  {petItem.petstages} </Text>
          <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{ paddingBottom: 40 }}>

            <Text style={{ fontSize: 16, marginTop: 12, fontWeight: 'bold', }}>Pet Story</Text>
            <Text style={styles.paragraph}>{petItem.desc} </Text>
            <View style={{ marginTop: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.paragraphTitle}>Sterilisation: </Text>
                <Text style={styles.paragraph}> {petItem.sterilisation}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.paragraphTitle}>Vaccinated: </Text>
                <Text style={styles.paragraph}> {petItem.vaccinated}</Text>
              </View>
            </View>

            {/* Adoption Requirement */}
            <Text style={{ fontSize: 14, marginTop: 12, fontWeight: 'bold' }}>Adoption Requirement</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.paragraphTitle}>Require Address Prove: </Text>
              <Text style={styles.paragraph}> {petItem.hvAddressProve}</Text>
              {(petItem.hvAddressProve == 'true' && (addressDocUri == '' || addressDocUri == undefined)) ?
                <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>

            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>Require Income Prove: </Text>
              <Text style={styles.paragraph}>{petItem.hvIncomeProve}</Text>
              {(petItem.hvIncomeProve == 'true' && (incomeDocUri == '' || incomeDocUri == undefined)) ?
                <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>Family Total Income: </Text>
              <Text style={styles.paragraph}>{petItem.totalIncome}</Text>
              {(petItem.totalIncome && (totalIncome < petItem.totalIncome || totalIncome == undefined || totalIncome == '')) ?
                <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>Apartment Type: </Text>
              <Text style={styles.paragraph}>{petItem.apartmentType}</Text>
              {(petItem.apartmentType == 'non_public_housing' && apartmentType != petItem.apartmentType) ? <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>apartmentSize: </Text>
              <Text style={styles.paragraph}>{petItem.apartmentSize}</Text>
              {(petItem.apartmentSize && (apartmentSize < petItem.apartmentSize || apartmentSize == undefined || apartmentSize == '')) ?
                <Text style={styles.required}> Required</Text> : <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>hvExperience: </Text>
              <Text style={styles.paragraph}>{petItem.hvExperience}</Text>
              {(petItem.hvExperience == 'true' && hvExperience != petItem.hvExperience) ? <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>hvWindowScreen: </Text>
              <Text style={styles.paragraph}>{petItem.hvWindowScreen}</Text>
              {(petItem.hvWindowScreen == 'true' && hvWindowScreen != petItem.hvWindowScreen) ? <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>numOfOtherPet: </Text>
              <Text style={styles.paragraph}>{petItem.numOfOtherPet}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>otherPetDescription: </Text>
              <Text style={styles.paragraph}>{petItem.otherPetDescription}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>hvSmoker: </Text>
              <Text style={styles.paragraph}>{petItem.hvSmoker}</Text>
              {(petItem.hvSmoker == 'true' && hvSmoker != petItem.hvSmoker) ? <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>hvAllergySymptoms: </Text>
              <Text style={styles.paragraph}>{petItem.hvAllergySymptoms} </Text>
              {(petItem.hvAllergySymptoms == 'true' && hvAllergySymptoms != petItem.hvAllergySymptoms) ? <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}
            </View>
            <View style={{ flexDirection: 'row' }}><Text style={styles.paragraphTitle}>hvRespiratoryDiseases: </Text>
              <Text style={styles.paragraph}>{petItem.hvRespiratoryDiseases}</Text>
              {(petItem.hvRespiratoryDiseases == 'true' && hvRespiratoryDiseases != petItem.hvRespiratoryDiseases) ? <Text style={styles.required}> Required</Text> :
                <Text style={styles.fulfilled}> Fulfilled</Text>}

            </View>
          </ScrollView>




        </View>

        <View style={styles.footerContainer}>
          <View style={styles.ownerContainer}>
            {(ownerImagepath != "" && ownerImagepath != undefined) ?
              <Avatar
                size={50}
                rounded
                source={{ uri: ownerImagepath }}
              /> : <Avatar
                size={50}
                rounded
                title={ownerName ? ownerName[0] : ""}
                containerStyle={{ backgroundColor: '#aaaaaa' }}

              />

            }
            <View style={styles.ownerDetailContainer}>
              <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{ownerName}</Text>
              <Text style={{ fontSize: 12, color: '#aaaaaa' }}>owner</Text>
            </View>
          </View>
          <Button buttonStyle={styles.contactbutton}
            containerStyle={styles.contactbuttonContainer}
            titleStyle={{ fontWeight: 'bold', fontSize: 11 }}
            title="Send Adopt Request"
            onPress={() => {
              sendContactRequest()
            }}
          >
          </Button>
        </View>
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    height: "100%"
  },
  iconContainer: {
    marginTop: 40,
    padding: 20,
    alignSelf: 'flex-start',
    zIndex: 1,
    position: 'absolute'
  },
  iconContainer2: {
    marginTop: 40,
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
    fontSize: 12, marginBottom: 12, fontWeight: 'bold', color: '#888888'
  },
  paragraph: {
    fontSize: 12, color: '#999999'
  },
  required: {
    fontSize: 12, color: 'red'
  },
  fulfilled: {
    fontSize: 12, color: 'green'
  },
  paragraphTitle: {
    fontSize: 12, color: '#999999', fontWeight: 'bold'
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



