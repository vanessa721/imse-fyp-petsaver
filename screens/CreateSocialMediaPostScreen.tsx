
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref as storage_ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, ButtonGroup, Dialog, Input, Text } from 'react-native-elements';
import { auth, db, storage } from "../firebase";
import { ImageInfo } from '../types';




export default function CreateSocialMediaPostScreen({ route, navigation }: { route: any, navigation: any }) {
  const [petPostDataItem, setPetPostDataItem] = useState(route.params.petPostDataItem)

  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(2);
  const [submitButtomText, setSubmitButtomText] = useState('Submit');
  const [userId, setUserId] = useState<string | undefined>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [imagepath, setImage] = useState('');
  const [caption, setCaption] = useState('');


  //const [familySize, setPetName] = useState('');


  const pickImageByLibrary = async () => {
    try {
      console.log("pickImageByLibrary---")
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        maxWidth: 720,
        maxHeight: 720,
        presentationStyle: 1,

      });
      console.log("pickerResult: ", pickerResult)

      if (!pickerResult.cancelled) {
        console.log("setUploadingImage(true);")
        setUploadingImage(true);
        var snapshotDownloadURL = null;
        const { uri } = pickerResult as ImageInfo
        const imagename = Date.now() + "-" + getRandomString(5) + userId + 'petImage.png'
        const storageRef = storage_ref(storage, 'socialMediaImage/' + imagename);

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
      } else {
        console.log("pickerResult.cancelled")
      }
      console.log("setUploadingImage(false);")
      setUploadingImage(false);
    } catch (err) {
      console.log(err)
    }


  };


  const uploadPost = async () => {
    setUploading(true);

    const userId = auth.currentUser?.uid;
    console.log("auth.currentUser?.uid: ", userId)

    try {
      const docRef = await addDoc(collection(db, "PetPost/" + petPostDataItem.id + "/socialMediaPost"), {
        createdate: new Date(),
        caption: caption,
        imagepath: imagepath,
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
          <Input style={styles.input} placeholder="Write something here" label='Caption:'
            onChangeText={text => setCaption(text)} labelStyle={{ fontSize: 10 }}
            containerStyle={{ marginBottom: 20 }}
            multiline={true}
            numberOfLines={4} />

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
          <Text>Uploading Social Media Post Image, Please Wait</Text>
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