/*
Description: My Adopted Pet Card
Purpose: 1. To To render the UI component
*/

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-elements';


export const MyAdoptedPetCard = (petPostDataItem: any, navigation: any) => (
    <View style={styles.CardContainer}>

        {petPostDataItem.item.imagepath != "" && <Image style={styles.imageitem}
            source={{ uri: petPostDataItem.item.imagepath }}
        />}
        <View style={styles.contentContainer}>

            <Text style={styles.petname}>{petPostDataItem.item.petname}</Text>
            <Text style={styles.petgender}>{petPostDataItem.item.petgender}  -  {petPostDataItem.item.petstages} </Text>

            <View style={styles.askbuttonContainer}>
                <Button buttonStyle={styles.askbutton}
                    titleStyle={{ fontWeight: 'bold', fontSize: 11 }}
                    title="New Social Media Post"
                    onPress={() => {
                        console.log("navigate to 'CreateSocialMediaPostScreen", petPostDataItem)
                        return navigation.navigate('CreateSocialMediaPost', { 'petPostDataItem': petPostDataItem.item });
                    }}
                >
                </Button>
            </View>

        </View>
    </View >
);
const styles = StyleSheet.create({
    CardContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 25,
        padding: 10,
        borderWidth: 1,
        borderColor: '#dddddd',
        marginVertical: 15,
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
    petgender: { fontSize: 10, marginBottom: 12, fontWeight: 'bold', color: '#888888' },
    desc: { fontSize: 10, color: '#999999' },
    imageitem: {
        aspectRatio: 0.95,
        width: '50%',
        borderRadius: 25,
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
    }

});
