/*
Description: Adopted Pet Card
Purpose: 1. To To render the UI component
*/

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


const DropdownScreen = (props: any) => {
    const [dropdown, setDropdown] = useState(props.initvalue);
    const [selected, setSelected] = useState([]);
    useEffect(() => {
        setDropdown(props.initvalue)

    }, []);
    const _renderItem = (item: { label: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Dropdown
                style={styles.dropdown}
                containerStyle={styles.shadow}
                data={props.data}
                labelField="label"
                valueField="value"
                placeholder={props.initvalue ? props.initvalue : 'Select a value'}
                value={dropdown}
                maxHeight={112}
                onChange={item => {
                    setDropdown(item.value);
                    props.setValue(item.value)
                }}
                renderItem={item => _renderItem(item)}
            />
        </View>
    );
};

export default DropdownScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    dropdown: {
        backgroundColor: 'white',
        borderBottomColor: '#aaaaaa',
        borderBottomWidth: 0.5,

    },
    icon: {
        marginRight: 5,
        width: 18,
        height: 18,
    },
    item: {
        paddingVertical: 17,
        paddingHorizontal: 4,
    },
    textItem: {
        fontSize: 16,
    },
    shadow: {
        top: -60,
        shadowColor: '#aaaaaa',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});
