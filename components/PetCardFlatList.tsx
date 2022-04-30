import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { PetCard } from '../components/PetCard';
import { db } from "../firebase";
import { HomeStackParamList, petPostDataProps } from '../types';



export function PetCardFlatList(this: any, props: PetCardFlatListProps) {
    const [petPostDataArray, setpetPostDataArray] = useState<petPostDataProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        if (props.filter_column != '' && props.filter_value != '') {
            var q = query(collection(db, "PetPost"), orderBy('createdate', "desc"),
                where(props.filter_column, "==", props.filter_value));
        } else {
            var q = query(collection(db, "PetPost"), orderBy('createdate', "desc"));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setpetPostDataArray([])
            querySnapshot.forEach((doc) => {
                if (!doc.data()['adopterID']) {
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
                        sterilisation: doc.data()['sterilisation'],
                        vaccinated: doc.data()['vaccinated'],
                        hvAddressProve: doc.data()['hvAddressProve'],
                        hvIncomeProve: doc.data()['hvIncomeProve'],
                        totalIncome: doc.data()['totalIncome'],
                        apartmentType: doc.data()['apartmentType'],
                        apartmentSize: doc.data()['apartmentSize'],
                        hvExperience: doc.data()['hvExperience'],
                        hvWindowScreen: doc.data()['hvWindowScreen'],
                        numOfOtherPet: doc.data()['numOfOtherPet'],
                        otherPetDescription: doc.data()['otherPetDescription'],
                        hvSmoker: doc.data()['hvSmoker'],
                        hvAllergySymptoms: doc.data()['hvAllergySymptoms'],
                        hvRespiratoryDiseases: doc.data()['hvRespiratoryDiseases'],
                    }
                    setpetPostDataArray(oldArray => [...oldArray, newjson]);
                }

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
            <>

                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
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
                        renderItem={(item) => PetCard(item, props.navigation, props.petTypeFilter)}
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
        </>

    );
}


const styles = StyleSheet.create({
    uppergadient: {
        flex: 1,
        top: 0,
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

interface PetCardFlatListProps {
    filter_column: string,
    filter_value: string | undefined,
    petTypeFilter: string | undefined
    navigation: NativeStackNavigationProp<HomeStackParamList, "Home">

}
