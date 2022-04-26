import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-elements';
import { assetsObject } from '../assets/asset';




export const PetCatagory = ({ item }: any, petTypeFilter: string, setPetFilter: any) => (
    <View style={styles.imageitemContainer}>

        <TouchableOpacity
            onPress={() => {
                if (item.title != petTypeFilter) {
                    setPetFilter(item.title);
                } else {
                    setPetFilter('');
                }

                console.log("setPetFilter: ", item.title)
            }}>
            {item.title != petTypeFilter && petTypeFilter != '' ?
                <Image style={styles.imageitemNotSelected}
                    source={assetsObject[item.title]}
                /> :
                <Image style={styles.imageitem}
                    source={assetsObject[item.title]}
                />
            }

        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
    </View>
);

const styles = StyleSheet.create({
    imageitem: {
        aspectRatio: 1,
        height: 50,
        borderRadius: 25
    },
    imageitemNotSelected: {
        aspectRatio: 1,
        height: 50,
        borderRadius: 25,
        opacity: 0.4,

    },
    imageitemContainer: {
        width: "20%",
        flex: 1,
        margin: 5,
        alignItems: 'center',
        paddingBottom: 15,
    },
});


