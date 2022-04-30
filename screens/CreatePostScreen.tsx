
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref as storage_ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ButtonGroup, Dialog, Input, Text } from 'react-native-elements';
import { apartment_type_drop_down_data, boolean_drop_down_data, gender_drop_down_data, pet_stage_drop_down_data, pet_type_drop_down_data } from '../assets/asset';
import Dropdown from '../components/dropdown';
import { auth, db, storage } from "../firebase";
import { ImageInfo, SettingStackProps } from '../types';




export default function CreatePostScreen({ navigation }: SettingStackProps<'Setting'>) {
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(2);
  const [submitButtomText, setSubmitButtomText] = useState('Submit');
  const [userId, setUserId] = useState<string | undefined>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [imagepath, setImage] = useState("");
  const [petGender, setGenderValue] = useState<number | string>("Male");
  const [petStage, setStageValue] = useState<number | string>("Kid");
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [petAge, setPetAge] = useState<number | string>('');
  const [petDescription, setPetDescription] = useState('');

  const [sterilisation, setSterilisation] = useState('');
  const [vaccinated, setVaccinated] = useState('');
  const [hvAddressProve, setHvAddressProve] = useState('');
  const [hvIncomeProve, setHvIncomeProve] = useState('');
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

  //const [familySize, setPetName] = useState('');


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
      var snapshotDownloadURL = null;
      const { uri } = pickerResult as ImageInfo
      const imagename = Date.now() + "-" + getRandomString(5) + userId + 'petImage.png'
      const storageRef = storage_ref(storage, 'petImages/' + imagename);

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
      snapshotDownloadURL = await getDownloadURL(snapshot.ref);
      setImage(snapshotDownloadURL);
      console.log('File available at', snapshotDownloadURL);
    }
    setUploadingImage(false);

  };

  const pickImageByCamera = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5
    });
  };

  const uploadPost = async () => {
    setUploading(true);
    const userId = auth.currentUser?.uid;
    try {
      const docRef = await addDoc(collection(db, "PetPost"), {
        createdate: new Date(),
        postcreator: userId,
        imagepath: imagepath,
        petname: petName,
        petgender: petGender,
        petAge: petAge,
        petType: petType,
        petstages: petStage,
        desc: petDescription,
        sterilisation: sterilisation,
        vaccinated: vaccinated,

        hvAddressProve: hvAddressProve,
        hvIncomeProve: hvIncomeProve,
        totalIncome: totalIncome,
        apartmentType: apartmentType,
        apartmentSize: apartmentSize,
        hvExperience: hvExperience,
        hvWindowScreen: hvWindowScreen,
        numOfOtherPet: numOfOtherPet,
        otherPetDescription: otherPetDescription,
        hvSmoker: hvSmoker,
        hvRespiratoryDiseases: hvRespiratoryDiseases,
        hvAllergySymptoms: hvAllergySymptoms


      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document:  ", e);
    }

    setSubmitted(true)
    setUploading(false)
    setSubmitButtomText("Submitted")
  }

  useEffect(() => {
    setUserId(auth.currentUser?.uid);
  }, []);
  return (
    <>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ height: "100%", width: "100%" }}>
          <Text h4 style={{ marginLeft: 10, marginBottom: 30, color: '#0b9298', fontWeight: 'bold' }}>Pet Information: </Text>

          <Input style={styles.input} placeholder="eg. Charlie" label='Pet Name:' labelStyle={{ fontSize: 10 }}
            onChangeText={text => setPetName(text)} containerStyle={{ marginBottom: 20 }} />
          <Input style={styles.input} placeholder="eg. 0-100" label='Pet Age:'
            onChangeText={text => setPetAge(text)} containerStyle={{ marginBottom: 20 }} labelStyle={{ fontSize: 10 }} />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Pet Stages:</Text>
            <Dropdown data={pet_stage_drop_down_data} setValue={setStageValue} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Pet Gender:</Text>
            <Dropdown data={gender_drop_down_data} setValue={setGenderValue} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Pet Type:</Text>
            <Dropdown data={pet_type_drop_down_data} setValue={setPetType} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Pet is Vaccinated:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setVaccinated} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Finish Sterilisation:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setSterilisation} />
          </View>
          <Input style={styles.input} placeholder="Descript your pet here, eg. any health issue" label='Pet Description:'
            onChangeText={text => setPetDescription(text)} labelStyle={{ fontSize: 10 }}
            containerStyle={{ marginBottom: 20 }}
            multiline={true}
            numberOfLines={4} />
          <View style={styles.imagePickerContainer}>
            <Text style={styles.pickerLabel} >Pet Image: </Text>
            <View style={styles.paddingView} />
            {imagepath != "" &&
              <TouchableOpacity onPress={pickImageByLibrary}>
                <Image style={styles.imageitem}
                  source={{ uri: imagepath }}
                />
              </TouchableOpacity>
            }
            <ButtonGroup
              buttons={['Select an image']}
              selectedIndex={selectedButtonIndex}
              onPress={(value) => {
                pickImageByLibrary();
              }}
              containerStyle={{ marginBottom: 20 }}
            />
          </View>

          <Text h4 style={{ marginLeft: 10, marginVertical: 30, color: '#0b9298', fontWeight: 'bold' }}>Adoption Requirement: </Text>


          <Input style={styles.input} placeholder="eg. 20000" label='Minimum Household Monthly Income:'
            onChangeText={text => setTotalIncome(text)} containerStyle={{ marginBottom: 20 }}
            labelStyle={{ fontSize: 10 }} />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require Income Prove:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvIncomeProve} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require Address Prove:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvAddressProve} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require Apartment Type:</Text>
            <Dropdown data={apartment_type_drop_down_data} setValue={setApartmentType} />
          </View>
          <Input style={styles.input} placeholder="eg. 200" label='Minimum Living space per member(sq. ft.):'
            onChangeText={text => setApartmentSize(text)} containerStyle={{ marginBottom: 20 }}
            labelStyle={{ fontSize: 10 }} />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require Pet Experience:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvExperience} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require Window Screen:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvWindowScreen} />
          </View>
          <Input style={styles.input} placeholder="eg. 1" label='Maximum number of other pets:'
            onChangeText={text => setNumOfOtherPet(text)} containerStyle={{ marginBottom: 20 }}
            labelStyle={{ fontSize: 10 }} />
          <Input style={styles.input} placeholder="Certain type of pet in family is not allowd, pleaase descript here:" label='Other Pets Description:'
            onChangeText={text => setOtherPetDescription(text)} labelStyle={{ fontSize: 10 }}
            containerStyle={{ marginBottom: 20 }}
            multiline={true}
            numberOfLines={4} />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require No Smoker at Home:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvSmoker} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require No Family Member have Respiratory Diseases:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvRespiratoryDiseases} />
          </View>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel} >Require No Family Member have Allergy Symptoms:</Text>
            <Dropdown data={boolean_drop_down_data} setValue={setHvAllergySymptoms} />
          </View>


          <Button title={submitButtomText} onPress={uploadPost}
            loading={uploading}
            disabled={submitted}
            buttonStyle={{
              backgroundColor: 'rgba(111, 202, 186, 1)',
              borderRadius: 5,
              margin: 10, marginTop: 30
            }}

            titleStyle={{ fontSize: 12 }} />
        </ScrollView>

        <Dialog isVisible={uploadingImage}>
          <Text>Uploading Icon Image, Please Wait</Text>
          <Dialog.Loading />
        </Dialog>
      </View >
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
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
    width: 200,
    borderRadius: 25,
    fontSize: 12
  },
  contentContainer: {
    width: '50%',
    height: '100%',
    paddingLeft: 10,
    flex: 1,
  },
  petname: {
    fontWeight: 'bold',
    fontSize: 20
  },
  petgender: {
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
    paddingHorizontal: 10
  },
  paddingView: {
    paddingTop: 10
  }
});

function getRandomString(length: number) {
  var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}