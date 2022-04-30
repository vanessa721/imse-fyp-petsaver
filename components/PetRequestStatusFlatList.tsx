/*
Description: Pet Request Status FlatList
Purpose: 1. To To render the UI component
*/
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, doc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { auth, db } from "../firebase";
import { petPostDataProps, SettingStackParamList } from '../types';
import { PetRequestStatusCard } from './PetRequestStatusCard';


export function PetRequestStatusFlatList(this: any, props: PetRequestStatusFlatList) {
    const [petPostDataArray, setpetPostDataArray] = useState<petPostDataProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        var q = query(collection(db, "PetPost"), orderBy('createdate', "desc"), where("postcreator", "==", auth.currentUser?.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setpetPostDataArray([])

            querySnapshot.forEach(async (docSnap) => {

                var postRef = doc(db, "PetPost", docSnap.id);
                var requestRef = collection(postRef, "contactRequest");
                const q2 = query(requestRef, where("status", "==", "New request"));
                const requestUsers: string[] = [];

                const querySnapshot2 = await getDocs(q2);
                querySnapshot2.forEach((docSnap2) => {
                    requestUsers.push(docSnap2.id);

                });

                const newjson = {
                    id: docSnap.id,
                    imagepath: docSnap.data()['imagepath'],
                    petname: docSnap.data()['petname'],
                    petgender: docSnap.data()['petgender'],
                    petstages: docSnap.data()['petstages'],
                    desc: docSnap.data()['desc'],
                    postcreator: docSnap.data()['postcreator'],
                    requestUsers: requestUsers,
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

    return (
        <>
            {isLoading && <ActivityIndicator size="large" color='#298e96' />}
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
                renderItem={(item) => PetRequestStatusCard(item, props.navigation)}
                keyExtractor={item => item.id}
            />
            <View style={styles.lowergadient}>
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
                    style={{ height: 40 }}
                />
            </View>

        </>

    );
}


const styles = StyleSheet.create({
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

interface PetRequestStatusFlatList {
    navigation: NativeStackNavigationProp<SettingStackParamList, "ViewMyPost">

}
