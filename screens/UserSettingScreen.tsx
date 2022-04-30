
import { FontAwesome } from '@expo/vector-icons';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from 'expo-image-picker';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref as storage_ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Dialog, Input, Text } from 'react-native-elements';
import { apartment_type_drop_down_data, boolean_drop_down_data, gender_drop_down_data } from '../assets/asset';
import Dropdown from '../components/dropdown';
import { auth, db, storage } from "../firebase";
import { ImageInfo, SettingStackProps } from '../types';




export default function UserSettingScreen({ navigation }: SettingStackProps<'Setting'>) {
  const [userIconUri, setUserIconImage] = useState<string | undefined>('');
  const [userId, setUserId] = useState<string | undefined>('');
  const [UserGender, setGenderValue] = useState<string | undefined>("Male");
  const [UserName, setUserName] = useState<string | undefined>('');
  const [UserAge, setUserAge] = useState<string | undefined>('');
  const [UserDescription, setUserDescription] = useState<string | undefined>('');

  const [uploadingImage, setUploadingImage] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [submitButtomText, setSubmitButtomText] = useState('Submit');

  const [addressDocUri, setAddressDocUri] = useState('');
  const [uploadingAddress, setUploadingAddress] = useState(false);
  const [submitAddressButtomText, setSubmitAddressButtomText] = useState('Submit Address Prove');

  const [incomeDocUri, setIncomeDocUri] = useState('');
  const [uploadingIncome, setUploadingIncome] = useState(false);
  const [submitIncomeButtomText, setSubmitIncomeButtomText] = useState('Submit Income Prove');

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



  const getData = async () => {
    var userId = auth.currentUser?.uid;
    console.log("Get data: userId:", userId);
    if (!userId) return false;
    const unsub = onSnapshot(doc(db, "Users", userId), (doc) => {
      if (doc == undefined) return false;
      if (!doc.data()) return false;

      if (doc.data()?.desc) setUserDescription(doc.data()?.desc);
      if (doc.data()?.username) setUserName(doc.data()?.username);
      if (doc.data()?.usergender) setGenderValue(doc.data()?.usergender);
      if (doc.data()?.userAge) setUserAge(doc.data()?.userAge);
      if (doc.data()?.userIconUri) setUserIconImage(doc.data()?.userIconUri);
      if (doc.data()?.addressDocUri) {
        setAddressDocUri(doc.data()?.addressDocUri)
        setSubmitAddressButtomText("Address Prove Submitted")
      };
      if (doc.data()?.incomeDocUri) {
        setIncomeDocUri(doc.data()?.incomeDocUri)
        setSubmitIncomeButtomText("Income Prove Submitted")
      };

      if (doc.data()?.totalIncome) setTotalIncome(doc.data()?.totalIncome);
      if (doc.data()?.apartmentType) setApartmentType(doc.data()?.apartmentType);
      if (doc.data()?.apartmentSize) setApartmentSize(doc.data()?.apartmentSize);
      if (doc.data()?.hvExperience) setHvExperience(doc.data()?.hvExperience);
      if (doc.data()?.hvWindowScreen) setHvWindowScreen(doc.data()?.hvWindowScreen);
      if (doc.data()?.numOfOtherPet) setNumOfOtherPet(doc.data()?.numOfOtherPet);
      if (doc.data()?.otherPetDescription) setOtherPetDescription(doc.data()?.otherPetDescription);
      if (doc.data()?.hvSmoker) setHvSmoker(doc.data()?.hvSmoker);
      if (doc.data()?.hvAllergySymptoms) setHvRespiratoryDiseases(doc.data()?.hvAllergySymptoms);
      if (doc.data()?.hvRespiratoryDiseases) setHvAllergySymptoms(doc.data()?.hvRespiratoryDiseases);

    });

  }

  useEffect(() => {
    setUserId(auth.currentUser?.uid);
    getData()
  }, []);

  const pickImageByLibrary = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      maxWidth: 720,
      maxHeight: 720,
      presentationStyle: 1,
    });

    if (!pickerResult.cancelled) {
      setUploadingImage(true);
      const { uri } = pickerResult as ImageInfo
      //Set User Image
      var userIconDownloadURL = null
      if (uri) {
        const imagename = userId + "_icon.png";
        const storageRef = storage_ref(storage, 'userIcon/' + imagename);

        const blob: Blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const snapshot = await uploadBytes(storageRef, blob);
        userIconDownloadURL = await getDownloadURL(snapshot.ref);
        setUserIconImage(userIconDownloadURL);
        console.log('File available at', userIconDownloadURL);
      } else {
        console.log('user no image ', userId);
      }
    }
    console.log('user uploading image: ', userIconUri);
    setUploadingImage(false);

  };

  const uploadAddressDocument = async () => {
    setUploadingAddress(true)
    let result = await DocumentPicker.getDocumentAsync({}).then(async response => {
      if (response.type == 'success') {
        let { name, size, uri, mimeType, type } = response;
        let nameParts = name.split('.');
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          type: mimeType,
          size: size,
          uri: Platform.OS === 'ios' ? uri : uri,
        };
        console.log(fileToUpload, '...............file')
        setAddressDocUri(uri);

        if (uri) {
          const docName = userId + '_addressDoc.' + fileType;
          const storageRef = storage_ref(storage, 'addressDoc/' + docName);

          const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
          });
          const snapshot = await uploadBytes(storageRef, blob);
          var DownloadURL = await getDownloadURL(snapshot.ref);
          setAddressDocUri(DownloadURL);
          console.log('File available at', DownloadURL);
        } else {
          console.log('user no image ', userId);
        }
      }
    }).catch(error => {
      console.log(error)
    })
    setSubmitAddressButtomText("Address Prove Submitted")
    setUploadingAddress(false)
  };

  const uploadIncomeDocument = async () => {
    setUploadingIncome(true)
    let result = await DocumentPicker.getDocumentAsync({}).then(async response => {
      if (response.type == 'success') {
        let { name, size, uri, mimeType, type } = response;
        let nameParts = name.split('.');
        let fileType = nameParts[nameParts.length - 1];
        var fileToUpload = {
          name: name,
          type: mimeType,
          size: size,
          uri: Platform.OS === 'ios' ? uri : uri,
        };
        console.log(fileToUpload, '...............file')
        setIncomeDocUri(uri);

        if (uri) {
          const docName = userId + '_incomeDoc.' + fileType;
          const storageRef = storage_ref(storage, 'incomeDoc/' + docName);
          const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
          });
          const snapshot = await uploadBytes(storageRef, blob);
          var DownloadURL = await getDownloadURL(snapshot.ref);
          setIncomeDocUri(DownloadURL);
          console.log('File available at', DownloadURL);
        } else {
          console.log('user no doc ', userId);
        }
      }
    }).catch(error => {
      console.log(error)
    })
    setSubmitIncomeButtomText("Income Prove Submitted")
    setUploadingIncome(false)
  };

  const uploadUserUpdate = async () => {
    setUploading(true)
    //Set User Doc
    try {
      if (userId) {
        const UserRef = doc(db, 'Users', userId);
        await updateDoc(UserRef, {
          userIconUri: userIconUri,
          username: UserName,
          usergender: UserGender,
          desc: UserDescription,
          lastupdateDate: new Date(),
          userAge: UserAge,
          addressDocUri: addressDocUri,
          incomeDocUri: incomeDocUri,
          totalIncome: totalIncome,
          apartmentType: apartmentType,
          apartmentSize: apartmentSize,
          hvExperience: hvExperience,
          hvWindowScreen: hvWindowScreen,
          hvSmoker: hvSmoker,
          hvRespiratoryDiseases: hvRespiratoryDiseases,
          hvAllergySymptoms: hvAllergySymptoms,
        });
        console.log("Document written with ID: ", UserRef.id);
        Alert.alert(
          "Done", "User Info updated",
          [
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ]
        );
      } else {
        console.error("userId not found:  ", auth.currentUser);
      }
    } catch (e) {
      console.error("Error adding document:  ", e);
    }
    setUploading(false)
    setSubmitButtomText("Submitted")
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false} style={{ height: "100%", width: "100%", paddingTop: 15 }}>
          <View style={styles.imagePickerContainer}>
            <View style={styles.imageitem}>
              {(userIconUri != "" && userIconUri != undefined) ?
                <TouchableOpacity onPress={pickImageByLibrary}>
                  <Avatar
                    size={100}
                    rounded
                    source={{ uri: userIconUri }}
                  />
                </TouchableOpacity> :
                <TouchableOpacity onPress={pickImageByLibrary}>
                  <Avatar
                    size={100}
                    rounded
                    title={UserName ? UserName[0] : ""}
                    containerStyle={{ backgroundColor: '#aaaaaa' }}

                  />
                </TouchableOpacity>
              }
              <View style={styles.iconContainer}>
                <FontAwesome
                  name="camera"
                  size={25}
                  rounded
                  color="black"
                  iconStyle={{ backgroundColor: '#eb1561' }}
                  containerStyle={{ backgroundColor: '#eb1561' }}
                  avatarStyle={{ backgroundColor: '#eb1561' }}
                  overlayContainerStyle={{ backgroundColor: '#eb1561' }}
                  placeholderStyle={{ backgroundColor: '#eb1561' }}
                  onPress={() => { pickImageByLibrary }}
                />
              </View>
            </View>

          </View>

          <Input style={styles.input} placeholder="Eng Name here" label='User Name:' labelStyle={{ fontSize: 10 }}
            onChangeText={text => setUserName(text)} containerStyle={{ marginBottom: 20 }} value={UserName} />
          <Input style={styles.input} placeholder="0-100" label='User Age:' labelStyle={{ fontSize: 10 }}
            onChangeText={text => setUserAge(text)} containerStyle={{ marginBottom: 20 }} value={UserAge} />
          <Input style={styles.input} placeholder="Descript your User here" label='User Description:' labelStyle={{ fontSize: 10 }}
            onChangeText={text => setUserDescription(text)} containerStyle={{ marginBottom: 20 }} value={UserDescription}
            numberOfLines={4} multiline={true}

          />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >User Gender:</Text>
            <Dropdown data={gender_drop_down_data} setValue={setGenderValue} initvalue={UserGender} />
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Apartment Type:</Text>
            <Dropdown data={apartment_type_drop_down_data} setValue={setApartmentType} initvalue={apartmentType} />
          </View>
          <Input style={styles.input} placeholder="eg. 200" label='Living space per family member(sq. ft.):'
            onChangeText={text => setApartmentSize(text)} containerStyle={{ marginBottom: 20 }} value={apartmentSize}
            labelStyle={{ fontSize: 10 }} />
          <Input style={styles.input} placeholder="eg. 20000" label='Monthly household income:'
            onChangeText={text => setTotalIncome(text)} containerStyle={{ marginBottom: 20 }}
            labelStyle={{ fontSize: 10 }} value={totalIncome} />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Have Pet Experience:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvExperience} initvalue={hvExperience} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Have Window Screen:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvWindowScreen} initvalue={hvWindowScreen} />
          </View>
          <Input style={styles.input} placeholder="eg. 1" label='Number of other pets:'
            onChangeText={text => setNumOfOtherPet(text)} containerStyle={{ marginBottom: 20 }}
            labelStyle={{ fontSize: 10 }} />
          <Input style={styles.input} placeholder="Describe your existing pet here " label='Other Pets Description:'
            onChangeText={text => setOtherPetDescription(text)} labelStyle={{ fontSize: 10 }}
            containerStyle={{ marginBottom: 20 }}
            multiline={true}
            numberOfLines={4} />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >No Smoker at Home:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvSmoker} initvalue={hvSmoker} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >No Family Member have Respiratory Diseases:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvRespiratoryDiseases} initvalue={hvRespiratoryDiseases} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >No Family Member have Allergy Symptoms:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvAllergySymptoms} initvalue={hvAllergySymptoms} />
          </View>


          <Button title={submitAddressButtomText} onPress={uploadAddressDocument}
            loading={uploadingAddress}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 0.5)',
              borderRadius: 5,
              margin: 10,
            }}
            titleStyle={{ fontSize: 12 }} />
          <Button title={submitIncomeButtomText} onPress={uploadIncomeDocument}
            loading={uploadingIncome}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 0.5)',
              borderRadius: 5,
              margin: 10,
            }}
            titleStyle={{ fontSize: 12 }} />

          <Button title={submitButtomText} onPress={uploadUserUpdate}
            loading={uploading}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 1)',
              borderRadius: 5,
              margin: 10, marginTop: 30
            }}
            titleStyle={{ fontSize: 12 }} />
          <Dialog isVisible={uploadingImage}>
            <Text>Uploading Icon Image, Please Wait</Text>
            <Dialog.Loading />
          </Dialog>
        </ScrollView>
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: 'white',
    height: "100%"
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
  input: {
    fontSize: 16
  },
  pickerContainer: {
    paddingHorizontal: 10,
    marginBottom: 30

  },
  pickerLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgb(134, 147, 158)'
  },
  CardContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start', // if you want to fill rows left to right
    borderRadius: 25,
    padding: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    marginVertical: 15,
  },
  imageitem: {
    aspectRatio: 0.95,
    borderRadius: 25,
    fontSize: 12,

  },
  contentContainer: {
    width: '50%',
    height: '100%',
    paddingLeft: 10,
    flex: 1,
  },
  Username: {
    fontWeight: 'bold',
    fontSize: 20
  },
  Usergender: {
    fontSize: 10,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#888888'
  },
  desc: {
    fontSize: 10,
    color: '#999999'
  },
  askbutton: {
    backgroundColor: '#0b9298',
    borderRadius: 5,
    paddingHorizontal: 15
  },
  askbuttonContainer: {
    position: 'absolute',
    left: 10,
    bottom: 0,
  },
  imagePickerContainer: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 20
  },
  paddingView: {
    paddingTop: 10
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    right: 0,
    bottom: 0
  },
});

